Dear Applicant,

as you already know is n8n a free and open, fair-code licensed Workflow Automation Tool. n8n utilizes nodes to enable users to create their workflows. A node is an entry point for retrieving data, a function to process data or an exit for sending data. The data process includes filtering, recomposing and changing data. There can be one or several nodes for an API, service or app. You can connect multiple nodes, which allows you to create simple and complex workflows with them intuitively.

We ask you to provide your thoughts on the following problems:

1. We are using Node.js to execute the workflows and its nodes. Sometimes, single executions of workflows may take hours if not days to complete. We want to offer the option to timeout workflow execution. Since Javascript, and Node.js accordingly, is single-threaded, how would you implement a timeout feature without letting the whole program crash?

2. We want to offer n8n as a SaaS product with thousands of concurrent users. Please create an overview of your system proposal and explain briefly to a non technical person how it works. What are the advantages and disadvantages of your system?


Solution

1. I would use a non-blocking approach in this case by returning an early response to the client while I wait on the backend for the workflow to complete execution using a callback instead of async/await. This helps carry on with the flow. On completion, I could emit an event to handle necessary actions that should follow after the workflow execution. This way, we don't have to wait for an execution to finish before handling other things

2. Similar to the answer in question 1, the goal will be to avoid a blocking operation. With this, we can be sure to have a concurrent operation as most certainly we do not have to wait for one request to be completely resolved before handling another. Also, in order to handle the thousands of requests, a load balancer will be utilized.
The advantages of this would be that
a) We can handle as many requests as possible
b) One failure does not lead to the termination of other workflows execution as they're all handled separately.

