<?php



namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $title;

    #[ORM\Column(type: 'text')]
    private $content;

    #[ORM\Column(type: 'string', length: 255)]
    private $image1;

    #[ORM\Column(type: 'string', length: 255)]
    private $image2;

    #[ORM\Column(type: 'string', length: 255)]
    private $image3;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private $price;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $id_type;

    #[ORM\Column(type: 'integer')]
    private $stock;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $id_marque;

    #[ORM\Column(type: 'integer')]
    private $views = 0;

    #[ORM\Column(type: 'integer')]
    private $search = 0;

    #[ORM\Column(type: 'boolean')]
    private ?bool $recommandation = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image1;
    }

    public function setImage(string $image1): self
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

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getIdType(): ?int
    {
        return $this->id_type;
    }

    public function setIdType(?int $id_type): self
    {
        $this->id_type = $id_type;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getIdMarque(): ?int
    {
        return $this->id_marque;
    }

    public function setIdMarque(?int $id_marque): self
    {
        $this->id_marque = $id_marque;

        return $this;
    }
    
    public function getViews(): ?int
    {
        return $this->views;
    }

    public function setViews(int $views): self
    {
        $this->views = $views;

        return $this;
    }

    public function getSearches(): ?int
    {
        return $this->search;
    }

    public function setSearches(int $search): self
    {
        $this->search = $search;

        return $this;
    }

    public function isRecommandation(): ?bool
    {
        return $this->recommandation;
    }

    public function setRecommandation(bool $recommandation): static
    {
        $this->recommandation = $recommandation;
        
        return $this;
    }
}
