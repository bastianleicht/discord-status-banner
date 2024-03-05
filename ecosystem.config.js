module.exports = {
  apps : [
      {
          name: "status_bot",
          script: "./index.js",
          instances: 1,
          max_memory_restart: "300M",

          // Logging
          out_file: "./log/out.log",
          error_file: "./log/error.log",
          merge_logs: true,
          log_date_format: "DD-MM HH:mm:ss Z",
          log_type: "json",
      }
  ]
};
