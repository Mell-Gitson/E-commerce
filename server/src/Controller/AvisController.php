<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Avis;
use Psr\Log\LoggerInterface;

class AvisController extends AbstractController
{
    private $entityManager;
    private $logger;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger){
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    #[Route('/avis', name: 'app_avis', methods: ['POST'])]
    public function AvisShow(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $avis = $this->entityManager->getRepository(Avis::class)->findBy(["article_id" => $data["article_id"]]);
        $avi = [];

        foreach ($avis as $item) {
            $avi[] = [
                'id_user' => $item->getIdUser(),
                'commentaire' => $item->getCommentaire(),
                'note' => $item->getNotes(),
            ];
        }
        return $this->json($avi);
    }

    #[Route('/avis/add', name: 'add_avis', methods: ['POST'])]
    public function addAvis(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $this->logger->info('Données reçues', ['data' => $data]);

        $avis = new Avis();
        $avis->setIdUser($data["user_id"]);
        $avis->setCommentaire($data['commentaire']);
        $avis->setNotes($data['notes']);
        $avis->setArticleId($data['article_id']);

        try {
            $this->entityManager->persist($avis);
            $this->entityManager->flush();
            $this->logger->info('Avis ajouté avec succès');
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'ajout de l\'avis', ['exception' => $e->getMessage()]);
            return new JsonResponse(['message' => 'Erreur interne du serveur', 'error' => $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Avis ajouté avec succès'], 201);
    }
}