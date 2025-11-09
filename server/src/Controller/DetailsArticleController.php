<?php

namespace App\Controller;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Type;
use App\Entity\Marque;


class DetailsArticleController extends AbstractController
{
    #[Route('/api/articles/{id}', name: 'article_detail', methods: ['GET'])]
    public function getArticle(int $id, EntityManagerInterface $entityManager, ManagerRegistry $mr): JsonResponse
    {
        $article = $entityManager->getRepository(Article::class)->find($id);
        if (!$article) {
            return $this->json(['message' => 'aucun article'], 404);
        }
        $article->setViews($article->getViews() + 1);
        $entityManager->flush();

        $type = $mr->getRepository(Type::class)->findOneBy(['id' => $article->getIdType()]);
        $marque = $mr->getRepository(Marque::class)->findOneBy(['id' => $article->getIdMarque()]);

        return $this->json([
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'content' => $article->getContent(),
            'image' => $article->getImage(),
            'price' => $article->getPrice(),
            'id_type' => $article->getIdType(),
            'stock' => $article->getStock(),

            'id_marque' => $article->getIdMarque(),
            'views' => $article->getViews(),
            'search' => $article->getSearches(),
            'image2' => $article->getImage2(),
            'image3' => $article->getImage3(),

            'type' => $type->getName(),
            'marque' => $marque->getName()
        ]);
        
    }

    #[Route('/api/articles/{id}/colors', name: 'article_colors', methods: ['GET'])]
public function getArticleColors(int $id, EntityManagerInterface $entityManager): JsonResponse
{
    $articleColors = $entityManager->createQuery(
        'SELECT ac, c
        FROM App\Entity\ArticleColor ac
        JOIN ac.article a
        JOIN ac.color c
        WHERE a.id = :id'
    )->setParameter('id', $id)->getResult();

    if (!$articleColors) {
        return $this->json(['message' => 'color introuvé'], 404);
    }

    $colorData = array_map(function($articleColor) {
        return [
            'id' => $articleColor->getId(),
            'color_id' => $articleColor->getColor()->getId(), 
            'color' => $articleColor->getColor()->getName(),  
            'price' => $articleColor->getPrice(),
            'image1' => $articleColor->getImage1(),
            'image2' => $articleColor->getImage2(),
            'image3' => $articleColor->getImage3(),
            'reduction' => $articleColor->getReduction(),
            'nouveaute' => $articleColor->getNouveaute(),
            'stock' => $articleColor->getStock(),

        ];
    }, $articleColors);

    return $this->json($colorData);
}

 
}

