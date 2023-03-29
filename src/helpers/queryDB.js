async function queryDatabase(sql, connection) {
  const queryResults = await new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) reject(error);
      resolve(results);
    });
  });
  return queryResults;
}

module.exports = queryDatabase;
