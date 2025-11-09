<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Panier;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Article;
use App\Entity\ArticleColor;
use Psr\Log\LoggerInterface;


class PanierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager){
        $this->entityManager = $entityManager;
    }

    #[Route('/panier', name: 'panier', methods: ['POST'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $userId = $data['id'];
    
        $panierArticles = $em->getRepository(Panier::class)->findBy(['user_id' => $userId]);
    
        $articles = [];
        foreach ($panierArticles as $item) {
            $articleColor = $item->getArticleColor();
            if ($articleColor) {
                $articles[] = [
                    'article_id' => $articleColor->getId(),
                    'title' => $articleColor->getArticle()->getTitle(),
                    'price' => $articleColor->getPrice(),
                    'image' => $articleColor->getImage1(),
                    'quantite' => $item->getQuantite(),
                    'color' => $articleColor->getColorArticle(),
                ];
            }
        }
    
        return $this->json($articles);
    }
    

    #[Route('/panier/ajouter', name: 'panier_ajouter', methods: ['POST'])]
public function ajouter(Request $request, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse {
    try {
        $data = json_decode($request->getContent(), true);

        $logger->info('Received request data', ['data' => $data]);

        $articleColorId = $data['articleColorId'] ?? null;
        $quantite = $data['quantite'] ?? null;
        $userId = $data['user_id'] ?? null;

        if (!$articleColorId || !$quantite || !$userId) {
            $logger->error('Missing data', ['articleColorId' => $articleColorId, 'quantite' => $quantite, 'userId' => $userId]);
            return $this->json(['error' => 'Missing data'], 400);
        }

        $articleColor = $em->getRepository(ArticleColor::class)->find($articleColorId);
        if (!$articleColor) {
            $logger->error('Article color not found', ['articleColorId' => $articleColorId]);
            return $this->json(['error' => 'Article color not found'], 404);
        }

        $panierItem = $em->getRepository(Panier::class)->findOneBy([
            'user_id' => $userId,
            'articleColor' => $articleColor,
        ]);

        if ($panierItem) {
            $panierItem->setQuantite($panierItem->getQuantite() + $quantite);
        } else {
            $panierItem = new Panier();
            $panierItem->setUserId($userId);
            $panierItem->setArticleColor($articleColor);
            $panierItem->setQuantite($quantite);
            $em->persist($panierItem);
        }

        $em->flush();
        $logger->info('Cart updated successfully', ['panierItem' => $panierItem]);

        return $this->json(['status' => 'success']);
    } catch (\Exception $e) {
        $logger->error('Error', ['exception' => $e->getMessage()]);
        return $this->json(['error' => 'error'], 500);
    }
}


    #[Route('/panier/unlog', name: 'panier_unlog', methods: ['POST'])]
    public function unlogCart(Request $request, SessionInterface $session, EntityManagerInterface $em): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $articles = [];

        foreach ($data as $item) {
            if (!isset($item['articleColorId'])) {
                continue; 
            }

            $articleColorId = $item['articleColorId'];
            $quantite = $item['quantite'];

            $articleColor = $em->createQuery(
                'SELECT ac
                FROM App\Entity\ArticleColor ac
                JOIN ac.article a
                WHERE ac.id = :articleColorId'
            )->setParameter('articleColorId', $articleColorId)->getOneOrNullResult();

            if ($articleColor) {
                $articles[] = [
                    'article_id' => $articleColor->getId(),
                    'title' => $articleColor->getArticle()->getTitle(),
                    'price' => $articleColor->getPrice(),
                    'image' => $articleColor->getImage1(),
                    'quantite' => $quantite,
                    'color' => $articleColor->getColorArticle(),
                ];
            } else {
                return $this->json(['message' => 'aucun article trouvé'], 404);
            }
        }

        return $this->json($articles);
    }

    #[Route('/panier/supprimer', name: 'panier_supprimer', methods: ['POST'])]
    public function supprimer(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $articleId = $data['id'];
        $userId = $data['user_id'];
    
        $panierItem = $em->getRepository(Panier::class)->findOneBy([
            'user_id' => $userId,
            'article_id' => $articleId,
        ]);
    
        if ($panierItem) {
            $em->remove($panierItem);
            $em->flush();
        } else {
            return $this->json(['error' => 'aucun article trouvé'], 404);
        }
    
        return $this->json(['status' => 'success']);
    }
}