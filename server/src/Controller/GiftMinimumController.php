<?php

namespace App\Controller;
use App\Entity\GiftMinimum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;



class GiftMinimumController extends AbstractController
{
    #[Route('getMinimum', name: 'getMinimum', methods: ['GET'])]
    public function getMinimum(EntityManagerInterface $em, ManagerRegistry $mr): JsonResponse
    {
        $data = $em->getRepository(GiftMinimum::class)->findOneBy(['id' => 1]);
        if($data){
            $minimum = $data->getMinimum();
    
    
            return $this->json($minimum);
        }else{
            return $this->json([
                "minimum" => "null",
            ]);
        }
        
    }

    #[Route('setMinimum', name: 'setMinimum', methods: ['POST'])]
    public function setMinimum(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $minimum = new GiftMinimum();
        $minimum = $em->getRepository(GiftMinimum::class)->findOneBy(['id' => 1]);
        $minimum->setMinimum($data);

        $em->persist($minimum);
        $em->flush();

        return $this->json("validate");
    }
}