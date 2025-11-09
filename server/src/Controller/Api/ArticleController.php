<?php
namespace App\Controller\Api;

use App\Entity\Article;
use App\Entity\Type;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Marque;
use App\Entity\ArticleColor;
use App\Entity\Color;

class ArticleController extends AbstractController
{
    #[Route('/api/articles', name: 'api_articles_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em, ManagerRegistry $mr, LoggerInterface $logger): JsonResponse
    {
        try {
            $articles = $em->getRepository(Article::class)->findAll();
            $logger->info('Article populaire ok ');

            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image' => $article->getImage(),
                    'price' => $article->getPrice(),
                    'stock' => $article->getStock(),
                    'views' => $article->getViews(),
                    'search' => $article->getSearches()
                ];
            }

            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/articlesColor', name: 'api_articlesColor_create', methods: ['POST'])]
    public function createArticleColor(Request $request, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $articleColor = new ArticleColor();
            $articleColor->setPrice($data['price']);
            $articleColor->setImage1($data['image1']);
            $articleColor->setImage2($data['image2']);
            $articleColor->setImage3($data['image3']);
            $articleColor->setReduction($data['reduction']);
            $articleColor->setNouveaute($data['nouveaute']);
            $articleColor->setNotes($data['notes']);
            $articleColor->setStock($data['stock']);
            $article = $em->getRepository(Article::class)->find($data['article_id']);
            if (!$article) {
                return $this->json(['error' => 'Article not found'], 404);
            }
            $articleColor->setArticle($article);
            $color = $em->getRepository(Color::class)->find($data['color_id']);
            if (!$color) {
                return $this->json(['error' => 'Color not found'], 404);
            }
            $articleColor->setColor($color);
            $em->persist($articleColor);
            $em->flush();
    
            return $this->json(['message' => 'ArticleColor created successfully'], 201);
        } catch (\Exception $e) {
            $logger->error('Error creating ArticleColor: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
    
    

    #[Route('/popular', name: 'popular', methods: ['GET'])]
    public function popular(EntityManagerInterface $em, ManagerRegistry $mr, LoggerInterface $logger): JsonResponse
    {
        try {
            $articles = $em->getRepository(Article::class)->findBy([], ['views' => 'DESC'], 3);
            $logger->info('Article populaire ok ');

            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image1' => $article->getImage(),
                    'image2' => $article->getImage2(),
                    'image3' => $article->getImage3(),
                    'price' => $article->getPrice(),
                    'stock' => $article->getStock(),
                    'views' => $article->getViews(),
                    'search' => $article->getSearches()
                ];
            }

            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/recommended', name: 'recommended', methods: ['GET'])]
    public function recommended(EntityManagerInterface $em, ManagerRegistry $mr, LoggerInterface $logger): JsonResponse
    {
        try {
            $articles = $em->getRepository(Article::class)->findBy(['recommandation' => 1]);
            $logger->info('Articles recommandés ok ');

            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image1' => $article->getImage(),
                    'image2' => $article->getImage2(),
                    'image3' => $article->getImage3(),
                    'price' => $article->getPrice(),
                    'stock' => $article->getStock(),
                    'views' => $article->getViews(),
                    'search' => $article->getSearches()
                ];
            }

            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/news', name: 'news', methods: ['GET'])]
    public function news(EntityManagerInterface $em, ManagerRegistry $mr, LoggerInterface $logger): JsonResponse
    {
        try {
            $queryBuilder = $em->getRepository(Article::class)->createQueryBuilder('a')->orderBy('a.id', 'DESC');
            $articles = $queryBuilder->getQuery()->getResult();
            
            $logger->info('Nouveaux articles ok');

            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image1' => $article->getImage(),
                    'image2' => $article->getImage2(),
                    'image3' => $article->getImage3(),
                    'price' => $article->getPrice(),
                    'stock' => $article->getStock(),
                    'views' => $article->getViews(),
                    'search' => $article->getSearches()
                ];
            }

            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/AllArticles', name: 'api_allArticles', methods: ['GET'])]
    public function AllArticles(EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $articles = $em->getRepository(Article::class)->findAll();

            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image1' => $article->getImage(),
                    'image2' => $article->getImage2(),
                    'image3' => $article->getImage3(),
                    'price' => $article->getPrice(),
                    'stock' => $article->getStock(),
                    'views' => $article->getViews(),
                    'search' => $article->getSearches(),
                    'recommandation' => $article->isRecommandation(),
                ];
            }

            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/searchArticle', name: 'searchArticle', methods: ['POST'])]
    public function searchArticle(EntityManagerInterface $em, Request $request, LoggerInterface $logger, ManagerRegistry $mr,): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $searchType = $data["searchType"] ?? '';
            $searchTitle = $data["searchTitle"] ?? '';
            $searchMarque = $data["searchMarque"] ?? '';
    
            $queryBuilder = $em->getRepository(Article::class)->createQueryBuilder('a');
    
            if ($searchTitle) {
                $queryBuilder->andWhere('a.title LIKE :searchTitle')
                    ->setParameter('searchTitle', '%' . $searchTitle . '%');
            }
    
            if ($searchType) {
                $type = $mr->getRepository(Type::class)->findOneBy(['name' => $searchType]);

                if ($type) {
                    $queryBuilder->andWhere('a.id_type = :id_type')
                        ->setParameter('id_type', $type->getId());
                }
            }

            if ($searchMarque) {
                $marque = $mr->getRepository(Marque::class)->findOneBy(['name' => $searchMarque]);

                if ($marque) {
                    $queryBuilder->andWhere('a.id_marque = :id_marque')
                        ->setParameter('id_marque', $marque->getId());
                }
            }
    
    
            $articles = $queryBuilder->getQuery()->getResult();
    
            $logger->info('Articles fetched successfully.');
    
            $articlesArray = [];
            foreach ($articles as $article) {
                $articlesArray[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'content' => $article->getContent(),
                    'image' => $article->getImage(),
                    'price' => $article->getPrice(),
                ];
            }
    
            return $this->json($articlesArray);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/incrementViews', name: 'incrementViews', methods: ['POST'])]
    public function incrementViews(EntityManagerInterface $em, LoggerInterface $logger, Request $request): JsonResponse
    {
        try {
            $id = json_decode($request->getContent(), true);
            $article = $em->getRepository(Article::class)->find($id);

            $article->setViews($article->getViews() + 1);
            $em->flush();

            return $this->json(['success' => 'Views incremented'], 200);
        } catch (\Exception $e) {
            $logger->error('Error fetching articles: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
    

    #[Route('/showarticlecolor', name: 'show_article_color', methods: ['GET'])]
    public function showArticleColor(EntityManagerInterface $entityManager, LoggerInterface $logger): JsonResponse
    {
        try {
            $articleColors = $entityManager->getRepository(ArticleColor::class)->findAll();

            if (!$articleColors) {
                return $this->json(['message' => 'aucun article coloré trouvé'], 404);
            }

            $colorData = array_map(function($articleColor) {
                return [
                    'id' => $articleColor->getId(),
                    'article_id' => $articleColor->getArticle()->getId(),
                    'color_id' => $articleColor->getColor()->getId(), 
                    'color' => $articleColor->getColor()->getName(),  
                    'price' => $articleColor->getPrice(),
                    'image1' => $articleColor->getImage1(),
                    'image2' => $articleColor->getImage2(),
                    'image3' => $articleColor->getImage3(),
                    'reduction' => $articleColor->getReduction(),
                    'nouveaute' => $articleColor->getNouveaute()
                ];
            }, $articleColors);

            return $this->json($colorData);
        } catch (\Exception $e) {
            $logger->error('Error fetching article colors: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}