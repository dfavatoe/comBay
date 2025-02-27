const getAllRecords =
  (Model, populateOptions = null) =>
  async (req, res) => {
    console.log(`Fetching all records from ${Model.modelName}`);

    try {
      let query = Model.find();

      // If populate options exist, apply them
      if (populateOptions) {
        query = query.populate(populateOptions);
      }

      const records = await query;

      console.log(`All Records fetched from ${Model.modelName}`, records);

      if (!records.length) {
        return res.status(200).json({
          message: "No records found in the database.",
          amount: 0,
          records: [],
        });
      }
      res.status(200).json({
        message: "All the records from the database.",
        amount: records.length,
        records,
      });
    } catch (error) {
      console.error(`Error fetching:`, error);
      res.status(500).json({ error: "Something went wrong" });
    }
  };

export { getAllRecords };
