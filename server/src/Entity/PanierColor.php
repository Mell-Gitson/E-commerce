<?php

namespace App\Entity;

use App\Repository\PanierColorRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PanierColorRepository::class)]
class PanierColor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column]
    private ?int $quantite;
    #[ORM\Column]
    private ?string $color;
    #[ORM\Column]
    private ?string $title;
    #[ORM\Column]
    private ?string $price;
    #[ORM\Column]
    private ?string $image1;
    #[ORM\Column]
    private ?string $user_id;
    #[ORM\Column]
    private ?int $article_id;



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantite(): ?int
    {
        return $this->quantite;
    }

       public function getColor(): ?int
    {
        return $this->color;

    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function getImage1(): ?string
    {
        return $this->image1;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function setQuantite(?int $quantite): self
    {
        $this->quantite = $quantite;

        return $this;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function setPrice(?string $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function setImage1(?string $image1): self
    {
        $this->image1 = $image1;

        return $this;
    }

    public function getUserId(): ?string
    {
        return $this->user_id;
    }

    public function setUserId(?string $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getArticleId(): ?int
    {
        return $this->article_id;
    }

    public function setArticleId(?int $article_id): self
    {
        $this->article_id = $article_id;

        return $this;
    }

}
