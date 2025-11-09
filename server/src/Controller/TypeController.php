<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use App\Entity\Type;
use App\Entity\Article;
use App\Entity\Color;

class TypeController extends AbstractController
{
    #[Route('/allType', name: 'type', methods: ['GET'])]
    public function allType(EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $types = $em->getRepository(Type::class)->findAll();
            $logger->info('Types fetched successfully.');

            $typesArray = [];
            foreach ($types as $type) {
                $typesArray[] = [
                    'id' => $type->getId(),
                    'name' => $type->getName(),
                ];
            }

            return $this->json($typesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/searchType', name: 'searchType', methods: ['POST'])]
    public function searchType(ManagerRegistry $mr, Request $request, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $search = $data["search"] ?? '';

            $typesArray = [];
            if ($search) {
                $queryBuilder = $em->getRepository(Type::class)->createQueryBuilder('t');
                $queryBuilder->andWhere('t.name LIKE :search')
                ->setParameter('search', '%' . $search . '%');
                $types = $queryBuilder->getQuery()->getResult();
                foreach ($types as $type) {
                    $articles = $mr->getRepository(Article::class)->findBy(['id_type' => $type->getId()]);
                    $typesArray[] = [
                        'id' => $type->getId(),
                        'name' => $type->getName(),
                        'numberOfArticles' => count($articles)
                    ];
                }
            }

            return $this->json($typesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/color/{id}', name: 'delete_color', methods: ['DELETE'])]
public function deleteColor(int $id, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
{
    try {
        $color = $em->getRepository(Color::class)->find($id);

        if (!$color) {
            return $this->json(['error' => 'Color not found'], 404);
        }

        $em->remove($color);
        $em->flush();

        $logger->info('Color deleted successfully');

        return $this->json(['message' => 'Color deleted successfully'], 200);
    } catch (\Exception $e) {
        $logger->error('Error deleting color: ' . $e->getMessage());
        return $this->json(['error' => $e->getMessage()], 500);
    }
}


    
}