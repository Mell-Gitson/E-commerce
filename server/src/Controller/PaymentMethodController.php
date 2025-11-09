<?php

namespace App\Controller;
use App\Entity\PaymentMethods;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;



class PaymentMethodController extends AbstractController
{
    #[Route('/getPaymentMethod', name: 'getPaymentMethod', methods: ['POST'])]
    public function getPaymentMethod(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['userId'])) {
            return $this->json([
                "methodId" => "userId undefined"
             ]);      
        }
        
        $paymentMethod = $em->getRepository(PaymentMethods::class)->findOneBy(['user_id' => (intval($data['userId']))]);
        

        if($paymentMethod){
            $methodId = $paymentMethod->getMethodId();

            return $this->json([
                "methodId" => $methodId
             ]);   
        } else {
            return $this->json([
                "methodId" => false
             ]); 
        }
    }

    #[Route('/setPaymentMethod', name: 'setPaymentMethod', methods: ['POST'])]
    public function setPaymentMethod(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $paymentMethod = new PaymentMethods();
        $paymentMethod->setUserId(intval($data['userId']));
        $paymentMethod->setMethodId($data['methodId']);

        $em->persist($paymentMethod);
        $em->flush();

        return $this->json("validate");
    }


    #[Route('/updatePaymentMethod', name: 'updatePaymentMethod', methods: ['PUT'])]
    public function updatePaymentMethod(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $paymentMethod = $em->getRepository(PaymentMethods::class)->findOneBy(['user_id' => intval($data['userId'])]);
        
        $paymentMethod->setMethodId($data['methodId']);
        $em->flush();

        return $this->json("validate");
    }
}