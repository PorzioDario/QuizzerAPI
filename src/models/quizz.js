const quizz = (sequelize, DataTypes) => {
	const Quizz = sequelize.define('quizzes', {
		name: { type: DataTypes.STRING, unique: false },
		userId: { type: DataTypes.INTEGER },
		description: { type: DataTypes.STRING },
		duration: { type: DataTypes.INTEGER }
	});
	
	Quizz.associate = models => {
		Quizz.belongsTo(models.User);
	  };

	return Quizz;
};

export default quizz;