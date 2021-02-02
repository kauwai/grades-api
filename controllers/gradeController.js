import { logger } from '../config/logger.js';
import { Grades } from '../models/Grades.js';

const create = async (req, res) => {
  const { name, subject, type, value } = req.body;
  try {
    const newGrade = await Grades.create({ name, subject, type, value });
    res.send({ message: 'Grade was inserted successfully' });
    logger.info(`POST /grade - ${JSON.stringify(newGrade)}`);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred when trying to save',
    });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;
  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};
  try {
    const response = await Grades.find(condition);
    res.send(response);
    logger.info(`GET /grade`);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Error while trying to display documents',
    });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const selectedGrade = await Grades.findOne({ _id: id });
    res.send(selectedGrade);
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error while searching for Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'The data provided to update was empty',
    });
  }

  const id = req.params.id;
  const { name, subject, type, value } = req.body;
  try {
    const updatedGrade = await Grades.findByIdAndUpdate(
      { _id: id },
      { name, subject, type, value },
      { new: true }
    );
    res.send(updatedGrade);
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error while trying to update Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedGrade = await Grades.findByIdAndDelete({ _id: id });
    res.send(deletedGrade);
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Could not delete Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    await Grades.deleteMany();
    res.send({ message: 'All grades have been deleted' });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error while trying to delete all Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
