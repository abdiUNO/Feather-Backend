import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserFCMToken1548351464308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'fcmToken',
        type: 'varchar(255)',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'fcmToken');
  }
}
