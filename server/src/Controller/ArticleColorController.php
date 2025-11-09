<?php

namespace App\Controller;

use App\Entity\ArticleColor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ArticleColorController extends AbstractController
{
    #[Route('/article-colors', name: 'list_article_colors', methods: ['GET'])]
    public function listArticleColors(EntityManagerInterface $entityManager): JsonResponse
    {
        $articleColors = $entityManager->getRepository(ArticleColor::class)->findAll();

        $data = [];
        foreach ($articleColors as $articleColor) {
            $data[] = [
                'id' => $articleColor->getId(),
                'article' => $articleColor->getArticle()->getId(),
                'color' => $articleColor->getColor()->getId(),
                'price' => $articleColor->getPrice(),
                'image1' => $articleColor->getImage1(),
                'image2' => $articleColor->getImage2(),
                'image3' => $articleColor->getImage3(),
                'reduction' => $articleColor->getReduction(),
                'nouveaute' => $articleColor->getNouveaute(),

            ];
        }

        return $this->json($data);
    }

    #[Route('/article-colors/{id}', name: 'update_article_color', methods: ['PUT'])]
    public function updateArticleColor($id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $articleColor = $entityManager->getRepository(ArticleColor::class)->find($id);

        if (!$articleColor) {
            return $this->json(['message' => 'Article not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['reduction'])) {
            $articleColor->setReduction($data['reduction']);
        }

        $entityManager->persist($articleColor);
        $entityManager->flush();

        return $this->json([
            'id' => $articleColor->getId(),
            'article' => $articleColor->getArticle()->getId(),
            'color' => $articleColor->getColor()->getId(),
            'price' => $articleColor->getPrice(),
            'image1' => $articleColor->getImage1(),
            'image2' => $articleColor->getImage2(),
            'image3' => $articleColor->getImage3(),
            'reduction' => $articleColor->getReduction(),
            'nouveaute' => $articleColor->getNouveaute(),
            'stock' => $articleColor->getStock(),
        ]);
    }

    #[Route('/decrementStock', name: 'decrementStock', methods: ['PUT'])]
    public function decrementStock(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $article = $em->getRepository(ArticleColor::class)->find($data['articleColorId']);
        
        $article->setStock($article->getStock() - $data['quantite']);
        $em->flush();
    
        return $this->json([
           "success" => "le stock a été décrémenté"
        ]);
    }
    
}