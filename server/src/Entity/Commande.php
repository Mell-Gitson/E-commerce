<?php

namespace App\Entity;

use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommandeRepository::class)]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $id_user = null;

    #[ORM\Column(length: 255)]
    private ?string $command_number = null;

    #[ORM\Column(length: 255)]
    private ?string $tracking_number = null;

    #[ORM\Column(length: 255)]
    private ?string $list_articles = null;

    #[ORM\Column(length: 255)]
    private ?string $status_command = null;

    #[ORM\Column(length: 255)]
    private ?string $status_livraison = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?int
    {
        return $this->id_user;
    }

    public function setIdUser(int $id_user): static
    {
        $this->id_user = $id_user;

        return $this;
    }

    public function getCommandNumber(): ?string
    {
        return $this->command_number;
    }

    public function setCommandNumber(string $command_number): static
    {
        $this->command_number = $command_number;

        return $this;
    }

    public function getTrackingNumber(): ?string
    {
        return $this->tracking_number;
    }

    public function setTrackingNumber(string $tracking_number): static
    {
        $this->tracking_number = $tracking_number;

        return $this;
    }

    public function getListArticles(): ?string
    {
        return $this->list_articles;
    }

    public function setListArticles(string $list_articles): static
    {
        $this->list_articles = $list_articles;

        return $this;
    }

    public function getStatusCommand(): ?string
    {
        return $this->status_command;
    }

    public function setStatusCommand(string $status_command): static
    {
        $this->status_command = $status_command;

        return $this;
    }

    public function getStatusLivraison(): ?string
    {
        return $this->status_livraison;
    }

    public function setStatusLivraison(string $status_livraison): static
    {
        $this->status_livraison = $status_livraison;

        return $this;
    }

    
}
