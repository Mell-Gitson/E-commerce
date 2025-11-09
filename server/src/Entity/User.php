<?php


namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $email;

    #[ORM\Column(type: 'string', length: 255)]
    private $pass;

    #[ORM\Column(type: 'string', length: 255)]
    private $lastname;

    #[ORM\Column(type: 'string', length: 255)]
    private $firstname;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $pays;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $adresse;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $ville;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $code_postal;



    



    #[ORM\Column(type: 'integer')]
    private $admin;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setPass($pass)
    {
        $this->pass = $pass;
    }

    public function getPass(): ?String
    {
        return $this->pass;
    }

    public function setLastname($lastname)
    {
        $this->lastname = $lastname;
    }

    public function getLastname(): ?String
    {
        return $this->lastname;
    }

    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setAdmin($admin)
    {
        $this->admin = $admin;
    }

    public function getAdmin(): ?int
    {
        return $this->admin;
    }
    public function setPays($pays)
    {
        $this->pays = $pays;
    }
    public function getPays(): ?string
    {
        return $this->pays;
    }
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;
    }   
    public function getAdresse(): ?string
    {
        return $this->adresse;
    }
    public function setVille($ville)
    {
        $this->ville = $ville;
    }
    public function getVille(): ?string
    {
        return $this->ville;
    }
    public function setCodePostal($code_postal)
    {
        $this->code_postal = $code_postal;
    }
    public function getCodePostal(): ?int
    {
        return $this->code_postal;
    }
}
