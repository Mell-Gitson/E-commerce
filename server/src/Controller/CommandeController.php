<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Commande;


class CommandeController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager){
        $this->entityManager = $entityManager;
    }

    #[Route('/commande', name: 'app_commande',  methods: ['POST'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['id'];

        $listCommande = $em->getRepository(Commande::class)->findBy(['id_user' => $userId]);
        
        $commandes = [];
        foreach ($listCommande as $item) {
                $commandes[] = [
                    'command_number' => $item->getCommandNumber(),
                    'tracking_number' => $item->getTrackingNumber(),
                ];
        }
        return $this->json($commandes);
    }

    #[Route('/validate', name: 'validate',  methods: ['POST'])]
    public function validate(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try{
            $data = json_decode($request->getContent(), true);
            $userId = $data['id'];
    
            $commande = new Commande; 
            $commande->setIdUser($userId);
            $commande->setCommandNumber($data['command_number']);
            $commande->setTrackingNumber($data['tracking_number']);
            $em->persist($commande);
            $em->flush();
            
            return $this->json([
                "success" => "true"
            ]);

        } catch(\Exception $e){
            return $this->json([
                "success" => "false"
            ]);
        }
    }
}
