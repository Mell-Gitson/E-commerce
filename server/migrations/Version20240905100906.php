<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240905100906 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_color ADD CONSTRAINT FK_11E13AF87ADA1FB5 FOREIGN KEY (color_id) REFERENCES color (id)');
        $this->addSql('CREATE INDEX IDX_11E13AF87ADA1FB5 ON article_color (color_id)');
        $this->addSql('ALTER TABLE article_color RENAME INDEX fk_11e13af87294869c TO IDX_11E13AF87294869C');
        $this->addSql('ALTER TABLE commande ADD list_articles VARCHAR(255) NOT NULL, ADD status_command VARCHAR(255) NOT NULL, ADD status_livraison VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_color DROP FOREIGN KEY FK_11E13AF87ADA1FB5');
        $this->addSql('DROP INDEX IDX_11E13AF87ADA1FB5 ON article_color');
        $this->addSql('ALTER TABLE article_color RENAME INDEX idx_11e13af87294869c TO FK_11E13AF87294869C');
        $this->addSql('ALTER TABLE commande DROP list_articles, DROP status_command, DROP status_livraison');
    }
}
