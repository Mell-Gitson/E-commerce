<?php

namespace App\Entity;

use App\Repository\PaymentMethodsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PaymentMethodsRepository::class)]
class PaymentMethods
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column(length: 255)]
    private ?string $method_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getMethodId(): ?string
    {
        return $this->method_id;
    }

    public function setMethodId(string $method_id): static
    {
        $this->method_id = $method_id;

        return $this;
    }
}
