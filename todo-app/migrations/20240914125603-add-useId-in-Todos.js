'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos','userId',{
      type:Sequelize.DataTypes.INTEGER
    })

    await queryInterface.addConstraint('Todos',{
      fields:['userId'],
      type:'foreign key',
      references:{
        table:'Users',
        field:'id',//this new column userId in Todos will reference as a foreign key to the primary key in User table
      }
    }


    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Todos','userId')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
