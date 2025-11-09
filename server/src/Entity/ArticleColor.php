<?php
// src/Entity/ArticleColor.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArticleColorRepository;

#[ORM\Entity(repositoryClass: ArticleColorRepository::class)]
class ArticleColor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Article::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Article $article = null;

    #[ORM\ManyToOne(targetEntity: Color::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Color $color = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $image1 = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $image2 = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $image3 = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $reduction = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $nouveaute = null;

    #[ORM\Column(type: 'integer', length: 255)]
    private ?string $notes = null;

    #[ORM\Column(type: 'integer', length: 255)]
    private ?string $stock = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): self
    {
        $this->article = $article;
        return $this;
    }

    public function getColor(): ?Color
    {
        return $this->color;
    }

    public function setColor(?Color $color): self
    {
        $this->color = $color;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getImage1(): ?string
    {
        return $this->image1;
    }

    public function setImage1(string $image1): self
    {
        $this->image1 = $image1;
        return $this;
    }

    public function getImage2(): ?string
    {
        return $this->image2;
    }

    public function setImage2(string $image2): self
    {
        $this->image2 = $image2;
        return $this;
    }

    public function getImage3(): ?string
    {
        return $this->image3;
    }

    public function setImage3(string $image3): self
    {
        $this->image3 = $image3;
        return $this;
    }

    public function getReduction(): ?string
    {
        return $this->reduction;
    }

    public function setReduction(string $reduction): self
    {
        $this->reduction = $reduction;
        return $this;
    }
    
    public function getNouveaute(): ?string
    {
        return $this->nouveaute;
    }

    public function setNouveaute(string $nouveauté): self
    {
        $this->nouveaute = $nouveauté;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(string $notes): self
    {
        $this->notes = $notes;
        return $this;
    }

    public function getStock(): ?string
    {
        return $this->stock;
    }

    public function setStock(string $stock): self
    {
        $this->stock = $stock;
        return $this;
    }
}

