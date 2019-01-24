import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMicroLinkTable1548349841819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE \`micro_link\` ( \`id\` varchar(255) NOT NULL, \`title\` varchar(255), \`image\` longtext, \`description\` longtext, \`logo\` longtext, \`url\` longtext NOT NULL, \`postId\` varchar(255) DEFAULT NULL, PRIMARY KEY (\`id\`), KEY \`FK_78a34c1725911f2d01309388964\` (\`postId\`), CONSTRAINT \`FK_78a34c1725911f2d01309388964\` FOREIGN KEY (\`postId\`) REFERENCES \`post\` (\`id\`) );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE micro_link`);
  }
}
