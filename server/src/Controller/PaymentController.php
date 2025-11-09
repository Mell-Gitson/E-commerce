<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Stripe\PaymentMethod;

class PaymentController extends AbstractController
{
    #[Route('/payment', name: 'payment', methods: ['POST'])]
    public function payment(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $stripe = Stripe::setApiKey($_ENV['STRIPE_PRIVATE_KEY']);

        $paymentIntent = PaymentIntent::create([
            'amount' => $data['amount'] * 100,
            'currency' => 'eur',
            'payment_method' => $data['paymentMethod']['id'],
        ]);

        return $this->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }

    #[Route('/getPaymentInfos', name: 'getPaymentInfos', methods: ['POST'])]
    public function getPaymentInfos(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $stripe = Stripe::setApiKey($_ENV['STRIPE_PRIVATE_KEY']);
       
        $paymentMethod = PaymentMethod::retrieve($data['methodId']);

        return $this->json([
            'paymentMethod' => $paymentMethod,
        ]);
    }
}
