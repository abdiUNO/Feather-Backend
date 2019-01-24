import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class PostRefactoring1548349281284 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'links',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'post',
      new TableForeignKey({
        columnNames: ['links'],
        referencedColumnNames: ['id'],
        referencedTableName: 'microlink',
      }),
    );

    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'image',
        type: 'longtext',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('links');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('links') !== -1,
    );
    await queryRunner.dropForeignKey('post', foreignKey);
    await queryRunner.dropColumn('post', 'links');
    await queryRunner.dropColumn('post', 'image');
  }
}
