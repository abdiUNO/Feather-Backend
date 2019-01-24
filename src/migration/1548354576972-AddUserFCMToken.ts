import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserFCMToken1548354576972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'fcmToken',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'fcmToken');
  }
}
