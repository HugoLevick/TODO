async function queryDatabase(sql, connection) {
  const queryResults = await new Promise((resolve) => {
    connection.query(sql, function (error, results) {
      if (error) throw error;
      resolve(results);
    });
  });
  return queryResults;
}

module.exports = queryDatabase;
