<?php


namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class GiftMinimum
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $minimum;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setMinimum($minimum)
    {
        $this->minimum = $minimum;
    }

    public function getMinimum(): ?int
    {
        return $this->minimum;
    }
}