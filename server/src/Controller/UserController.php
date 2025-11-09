<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Entity\Commande;

class UserController extends AbstractController
{
    #[Route('/api', name: 'app_user', methods: ['POST'])]
    public function index(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $userInfos = json_decode($request->getContent(), true);

        $checkEmail = $mr->getRepository(User::class)->findBy(['email' => $userInfos["email"]]);

        if ($checkEmail) {
            return $this->json([
                'inscription' => false
            ]);
        }
        
        $user = new User();
        $user->setEmail($userInfos["email"]);
        $user->setPass(sha1($userInfos["pass"]));
        $user->setLastname($userInfos["lastname"]);
        $user->setFirstname($userInfos["firstname"]);
        $user->setAdmin($userInfos["admin"]);
        $entityManagerUser = $mr->getManagerForClass(User::class);
        $entityManagerUser->persist($user);
        $entityManagerUser->flush();

        return $this->json([
            'inscription' => true
        ]);
    }

    #[Route('/user', name: 'insert_info', methods: ['PUT'])]
    public function user(Request $request, ManagerRegistry $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $checkUser = $em->getRepository(User::class)->findOneBy(['id' => $data["id"]]);

        $checkUser->setAdresse($data["adress"]);
        $checkUser->setVille($data["city"]);
        $checkUser->setCodePostal($data["zipcode"]);
        $checkUser->setPays($data["country"]);

        $entityManagerUser = $em->getManagerForClass(User::class);
        $entityManagerUser->persist($checkUser);
        $entityManagerUser->flush();

        return $this->json([
            'adresse' => true
        ]);
    }

    #[Route('/userinformation', name: 'insert_info', methods: ['POST'])]
    public function userinfo(Request $request, ManagerRegistry $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data['id'] == "null") {
            return $this->json([]);
        } else {
            $checkUser = $em->getRepository(User::class)->findOneBy(['id' => $data["id"]]);

            return $this->json([
                'adress' => $checkUser->getAdresse(),
                'city' => $checkUser->getVille(),
                'zipcode' => $checkUser->getCodePostal(),
                'country' => $checkUser->getPays(),
                'firstname' => $checkUser->getFirstname(),
                'lastname' => $checkUser->getLastname(),
                'email' => $checkUser->getEmail(),
            ]);
        }
    }

    #[Route('/connexion', name: 'connexion', methods: ['POST'])]
    public function connexion(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $userLogs = json_decode($request->getContent(), true);
    
        $connexion = $mr->getRepository(User::class)->findOneBy([
            'email' => $userLogs["email"], 
            'pass' => sha1($userLogs["pass"])
        ]);

        if ($connexion) {
            return $this->json([
                'connexion' => true,
                'id' => $connexion->getId(),
                'admin' => $connexion->getAdmin() 
            ]);
        } else {
            return $this->json([
                'connexion' => false,
            ]);
        }
    }

    #[Route('/admin', name: 'admin', methods: ['POST'])]
    public function checkAdmin(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $id = json_decode($request->getContent(), true);

        $connexion_id = $mr->getRepository(User::class)->findOneBy(['id' => $id["id"]]);
        $admin = $connexion_id->getAdmin();
        if ($admin == 1) {
            return $this->json([
                'admin' => true,
                'firstname' => $connexion_id->getFirstname(),
            ]);
        } else {
            return $this->json([
                'admin' => false,
            ]);
        }
    }

    #[Route('/admin/users', name: 'get_users', methods: ['GET'])]
    public function getUsers(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $users = $mr->getRepository(User::class)->findAll();

        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/admin/users', name: 'post_users', methods: ['POST'])]
    public function postUser(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $connexion_user = $mr->getRepository(User::class)->findOneBy(['id' => $data["id"]]);
        $connexion_user -> setfirstname($data['firstname']);
        $connexion_user-> setlastname($data['lastname']);
        $connexion_user-> setemail($data["email"]);
        $entityManagerUser = $mr->getManagerForClass(User::class);
        $entityManagerUser->persist($connexion_user);
        $entityManagerUser->flush();

        return $this->json([
            'operation' => 'sucess',
        ]);
    }

    #[Route('/admin/users', name: 'post_users', methods: ['DELETE'])]
    public function deleteUser(ManagerRegistry $mr, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $connexion_user = $mr->getRepository(User::class)->findOneBy(['id' => $data["id"]]);
        $entityManagerUser = $mr->getManagerForClass(User::class);
        $entityManagerUser->remove($connexion_user);
        $entityManagerUser->flush();

        return $this->json([
            'operation' => 'sucess',
        ]);
    }




    #[Route('/admin/commandes', name: 'get_commandes', methods: ['GET'])]
    public function getCommandes(ManagerRegistry $mr): JsonResponse
    {
        $commandes = $mr->getRepository(Commande::class)->findAll();

        $data = [];
        foreach ($commandes as $commande) {
            $data[] = [
                'id' => $commande->getId(),
                'id_user' => $commande->getIdUser(),
                'command_number' => $commande->getCommandNumber(),
                'tracking_number' => $commande->getTrackingNumber(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/user/{id}/update', name: 'update_user_info', methods: ['PUT'])]
    public function updateUserInfo(int $id, Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $entityManager = $doctrine->getManager();
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $user->setPass(sha1($data['password']));
        }
        if (isset($data['address'])) {
            $user->setAdresse($data['address']);
        }
        if (isset($data['city'])) {
            $user->setVille($data['city']);
        }
        if (isset($data['zipcode'])) {
            $user->setCodePostal($data['zipcode']);
        }
        if (isset($data['country'])) {
            $user->setPays($data['country']);
        }

        $entityManager->flush();

        return $this->json(['success' => 'Informations utilisateur mises à jour avec succès']);
    }


    #[Route('/api/user/{id}', name: 'get_user_info', methods: ['GET'])]
    public function getUserInfo(int $id, ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        return $this->json([
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'email' => $user->getEmail(),
            'address' => $user->getAdresse(),
            'city' => $user->getVille(),
            'zipcode' => $user->getCodePostal(),
            'country' => $user->getPays()
        ]);
    }

}

