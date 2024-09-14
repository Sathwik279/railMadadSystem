"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }
    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    //instance method
    markAsCompleted() {
      return this.update({ completed: true }); //here this is the Todo instance
    }

    setCompletionStatus(isCompleted) {
      return this.update({ completed: !isCompleted });
    }

    displayableString() {
      let today = new Date();
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate === today.toISOString().split("T")[0] ? "" : this.dueDate}`.trim();
    }

    static async overdue(userId) {
      let today = new Date();
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      let all = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today.toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
      return all;
    }

    static async dueToday(userId) {
      let today = new Date();
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      let all = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today.toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
      return all;
    }

    static async dueLater(userId) {
      let today = new Date();
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      let all = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today.toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
      return all;
    }

    static async completed(userId) {
      let all = await Todo.findAll({
        where: {
          completed: true,
          userId,
        },
      });
      return all;
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      //  const overdue = await Todo.findAll({
      //     where:{
      //       dueDate:{
      //         [Op.lt]: today.toISOString().split("T")[0]
      //       }
      //     }
      //   })
      //  //overdue is a list of todo objects
      //  const  overdueList = overdue.map((item)=>item.displayableString()).join("\n");
      const overdue = await Todo.overdue();
      const overdueList = overdue
        .map((item) => item.displayableString())
        .join("\n");
      console.log(overdueList);

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      //  const  duetoday = await Todo.findAll({
      //     where:{
      //       dueDate:{
      //         [Op.eq]: today.toISOString().split("T")[0]
      //       }
      //     }
      //   })

      const dueToday = await Todo.dueToday();
      const dueTodayList = dueToday
        .map((item) => item.displayableString())
        .join("\n");
      console.log(dueTodayList);

      console.log("Due Later");
      // FILL IN HERE
      //  const  duelater = await Todo.findAll({
      //     where:{
      //       dueDate:{
      //         [Op.gt]: today.toISOString().split("T")[0]
      //       }
      //     }
      //   })
      const dueLater = await Todo.dueLater();
      const dueLaterList = dueLater
        .map((item) => item.displayableString())
        .join("\n");
      console.log(dueLaterList);
    }

    //  async deleteTodo(id){
    //     try {
    //       await this.destroy();
    //       const todo = await Todo.findByPk(this.id);
    //       return todo === null;
    //     } catch (error) {
    //       // In case of error, return false
    //       return false;
    //     }
    //   }

    //this method is similar to the above method
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id: id,
          userId,
        },
      });
    }

    static getTodos() {
      return this.findAll();
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: true, len: 5 },
      },
      dueDate: {
        type:DataTypes.DATEONLY,
        allowNull:false
      },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
