<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use App\Entity\Color;

class ColorController extends AbstractController
{
    #[Route('/showcolor', name: 'color', methods: ['GET'])]
    public function showcolor(EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $types = $em->getRepository(Color::class)->findAll();
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
}
