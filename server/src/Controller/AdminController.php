<?php
namespace App\Controller;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Type;

class AdminController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    #[Route('/api/articles/recommandation', name: 'recommandation', methods: ['POST'])]
    public function updateRecommandation(Request $request): JsonResponse
    {
        // dd($id);
        $data = json_decode($request->getContent(), true);
        $article = $this->entityManager->getRepository(Article::class)->find($data['id_article']);

            if($data['recommandation'] === 'true'){
                $article->setRecommandation(1);

            }else{
                $article->setRecommandation(0);
            }
    
            $this->entityManager->persist($article);
            $this->entityManager->flush();
    
            $response = new JsonResponse($article, 201);
            $response->headers->set('Content-Type', 'application/json');
    
            return $response;
    }



     #[Route('/api/articles', name: 'admin_create_article', methods: ['POST'])]
    public function createArticle(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        if (strlen($data['image1']) > 2048) { 
            return new JsonResponse(['error' => 'Image URL is too long'], 400);
        }

        $article = new Article();
        $article->setTitle($data['title']);
        $article->setContent($data['content']);
        $article->setImage($data['image1']);
        $article->setImage2($data['image2']);
        $article->setImage3($data['image3']);
        $article->setPrice($data['price']);
        $article->setStock($data['stock']);
        $article->setIdType($data['id_type']);
        $article->setRecommandation($data['recommandation']);

        $this->entityManager->persist($article);
        $this->entityManager->flush();

        $response = new JsonResponse($article, 201);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    #[Route('/api/articles/{id}', name: 'admin_update_article', methods: ['PUT'])]
public function updateArticle(Request $request, int $id): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return new JsonResponse(['error' => 'Invalid JSON data'], 400);
    }

    $article = $this->entityManager->getRepository(Article::class)->find($id);

    if (!$article) {
        return new JsonResponse(['error' => 'Article not found'], 404);
    }

    $article->setTitle($data['title'] ?? $article->getTitle());
    $article->setContent($data['content'] ?? $article->getContent());
    $article->setImage($data['image1'] ?? $article->getImage());
    $article->setImage2($data['image2'] ?? $article->getImage2());
    $article->setImage3($data['image3'] ?? $article->getImage3());
    $article->setPrice($data['price'] ?? $article->getPrice());
    $article->setStock($data['stock'] ?? $article->getStock());
    $article->setIdType($data['id_type'] ?? $article->getIdType());

    $this->entityManager->flush();

    return new JsonResponse($article, 200);
}

#[Route('/api/articles/{id}', name: 'admin_delete_article', methods: ['DELETE'])]
public function deleteArticle(int $id): JsonResponse
{
    $article = $this->entityManager->getRepository(Article::class)->find($id);

    if (!$article) {
        return new JsonResponse(['error' => 'Article not found'], 404);
    }

    $this->entityManager->remove($article);
    $this->entityManager->flush();

    return new JsonResponse(['message' => 'Article deleted successfully'], 200);
}

#[Route('/api/types', name: 'admin_create_type', methods: ['POST'])]
    public function createType(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        $type = new Type();
        $type->setName($data['name']);

        $this->entityManager->persist($type);
        $this->entityManager->flush();

        return new JsonResponse($type, 201);
    }

    #[Route('/api/types/{id}', name: 'admin_update_type', methods: ['PUT'])]
    public function updateType(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        $type = $this->entityManager->getRepository(Type::class)->find($id);

        if (!$type) {
            return new JsonResponse(['error' => 'Type not found'], 404);
        }

        $type->setName($data['name'] ?? $type->getName());

        $this->entityManager->flush();

        return new JsonResponse($type, 200);
    }

    #[Route('/api/types/{id}', name: 'admin_delete_type', methods: ['DELETE'])]
    public function deleteType(int $id): JsonResponse
    {
        $type = $this->entityManager->getRepository(Type::class)->find($id);

        if (!$type) {
            return new JsonResponse(['error' => 'Type not found'], 404);
        }

        $this->entityManager->remove($type);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Type deleted successfully'], 200);
    }

    #[Route('/api/types', name: 'admin_get_types', methods: ['GET'])]
    public function getTypes(): JsonResponse
    {
        $types = $this->entityManager->getRepository(Type::class)->findAll();
        $data = [];
    
        foreach ($types as $type) {
            $data[] = [
                'id' => $type->getId(),
                'name' => $type->getName(),
            ];
        }
    
        return new JsonResponse($data, 200);
    }
    
}

