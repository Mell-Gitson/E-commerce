<?php


namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Achat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer')]
    private $id_users_buy;

    #[ORM\Column(type: 'integer')]
    private $id_articles_buy;

    #[ORM\Column(type: 'datetime')]
    private $historique_buy;

    
}
