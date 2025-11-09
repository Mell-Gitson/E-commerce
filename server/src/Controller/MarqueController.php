<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use App\Entity\Marque;
use App\Entity\Article;

class MarqueController extends AbstractController
{
    #[Route('/allMarque', name: 'marque', methods: ['GET'])]
    public function allType(EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $marques = $em->getRepository(Marque::class)->findAll();
            $logger->info('Marques fetched successfully.');

            $marquesArray = [];
            foreach ($marques as $marque) {
                $marquesArray[] = [
                    'id' => $marque->getId(),
                    'name' => $marque->getName(),
                ];
            }

            return $this->json($marquesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/searchMarque', name: 'searchMarque', methods: ['POST'])]
    public function searchMarque(ManagerRegistry $mr, Request $request, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $search = $data["search"] ?? '';

            $marquesArray = [];
            if ($search) {
                $queryBuilder = $em->getRepository(Marque::class)->createQueryBuilder('m');
                $queryBuilder->andWhere('m.name LIKE :search')
                ->setParameter('search', '%' . $search . '%');
                $marques = $queryBuilder->getQuery()->getResult();
                foreach ($marques as $marque) {
                    $articles = $mr->getRepository(Article::class)->findBy(['id_marque' => $marque->getId()]);
                    $marquesArray[] = [
                        'id' => $marque->getId(),
                        'name' => $marque->getName(),
                        'numberOfArticles' => count($articles)
                    ];
                }
            }

            return $this->json($marquesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}