export interface NodeTemplate {
  type: string;
  nodeType: "trigger" | "action" | "condition" | "transform" | "output";
  label: string;
  description: string;
  icon: string;
  category: string;
  defaultConfig: Record<string, unknown>;
  configSchema: {
    fields: {
      name: string;
      type: "text" | "textarea" | "select" | "number" | "boolean" | "json";
      label: string;
      placeholder?: string;
      options?: { value: string; label: string }[];
      required?: boolean;
    }[];
  };
}

export const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: "webhook",
    nodeType: "trigger",
    label: "Webhook",
    description: "Trigger workflow via HTTP webhook",
    icon: "Webhook",
    category: "Triggers",
    defaultConfig: { method: "POST", path: "/webhook" },
    configSchema: {
      fields: [
        { name: "method", type: "select", label: "Method", options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
        ]},
        { name: "path", type: "text", label: "Path", placeholder: "/webhook" },
      ],
    },
  },
  {
    type: "schedule",
    nodeType: "trigger",
    label: "Schedule",
    description: "Trigger on a time schedule",
    icon: "Clock",
    category: "Triggers",
    defaultConfig: { cron: "0 * * * *", timezone: "UTC" },
    configSchema: {
      fields: [
        { name: "cron", type: "text", label: "Cron Expression", placeholder: "0 * * * *" },
        { name: "timezone", type: "text", label: "Timezone", placeholder: "UTC" },
      ],
    },
  },
  {
    type: "manual",
    nodeType: "trigger",
    label: "Manual Trigger",
    description: "Start workflow manually",
    icon: "Play",
    category: "Triggers",
    defaultConfig: {},
    configSchema: { fields: [] },
  },

  // Actions
  {
    type: "http-request",
    nodeType: "action",
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: "Globe",
    category: "Actions",
    defaultConfig: { method: "GET", url: "", headers: {} },
    configSchema: {
      fields: [
        { name: "method", type: "select", label: "Method", options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
        ]},
        { name: "url", type: "text", label: "URL", placeholder: "https://api.example.com", required: true },
        { name: "headers", type: "json", label: "Headers" },
        { name: "body", type: "textarea", label: "Body" },
      ],
    },
  },
  {
    type: "send-email",
    nodeType: "action",
    label: "Send Email",
    description: "Send an email message",
    icon: "Mail",
    category: "Actions",
    defaultConfig: { to: "", subject: "", body: "" },
    configSchema: {
      fields: [
        { name: "to", type: "text", label: "To", placeholder: "email@example.com", required: true },
        { name: "subject", type: "text", label: "Subject", required: true },
        { name: "body", type: "textarea", label: "Body" },
      ],
    },
  },
  {
    type: "database",
    nodeType: "action",
    label: "Database Query",
    description: "Execute a database query",
    icon: "Database",
    category: "Actions",
    defaultConfig: { operation: "select", table: "", query: "" },
    configSchema: {
      fields: [
        { name: "operation", type: "select", label: "Operation", options: [
          { value: "select", label: "SELECT" },
          { value: "insert", label: "INSERT" },
          { value: "update", label: "UPDATE" },
          { value: "delete", label: "DELETE" },
        ]},
        { name: "table", type: "text", label: "Table Name" },
        { name: "query", type: "textarea", label: "Query/Data" },
      ],
    },
  },
  {
    type: "slack",
    nodeType: "action",
    label: "Slack Message",
    description: "Send a Slack message",
    icon: "MessageSquare",
    category: "Actions",
    defaultConfig: { channel: "", message: "" },
    configSchema: {
      fields: [
        { name: "channel", type: "text", label: "Channel", placeholder: "#general" },
        { name: "message", type: "textarea", label: "Message", required: true },
      ],
    },
  },

  // Conditions
  {
    type: "if-else",
    nodeType: "condition",
    label: "If/Else",
    description: "Branch based on condition",
    icon: "GitBranch",
    category: "Logic",
    defaultConfig: { condition: "", operator: "equals", value: "" },
    configSchema: {
      fields: [
        { name: "condition", type: "text", label: "Field", placeholder: "{{data.status}}" },
        { name: "operator", type: "select", label: "Operator", options: [
          { value: "equals", label: "Equals" },
          { value: "not_equals", label: "Not Equals" },
          { value: "contains", label: "Contains" },
          { value: "greater_than", label: "Greater Than" },
          { value: "less_than", label: "Less Than" },
        ]},
        { name: "value", type: "text", label: "Value" },
      ],
    },
  },
  {
    type: "switch",
    nodeType: "condition",
    label: "Switch",
    description: "Multi-way branch",
    icon: "GitMerge",
    category: "Logic",
    defaultConfig: { expression: "", cases: [] },
    configSchema: {
      fields: [
        { name: "expression", type: "text", label: "Expression", placeholder: "{{data.type}}" },
        { name: "cases", type: "json", label: "Cases" },
      ],
    },
  },

  // Transform
  {
    type: "transform-data",
    nodeType: "transform",
    label: "Transform",
    description: "Transform data format",
    icon: "Shuffle",
    category: "Transform",
    defaultConfig: { mapping: {} },
    configSchema: {
      fields: [
        { name: "mapping", type: "json", label: "Mapping" },
      ],
    },
  },
  {
    type: "filter",
    nodeType: "transform",
    label: "Filter",
    description: "Filter array items",
    icon: "Filter",
    category: "Transform",
    defaultConfig: { field: "", condition: "" },
    configSchema: {
      fields: [
        { name: "field", type: "text", label: "Field" },
        { name: "condition", type: "text", label: "Condition" },
      ],
    },
  },
  {
    type: "code",
    nodeType: "transform",
    label: "Code",
    description: "Execute custom JavaScript",
    icon: "Code",
    category: "Transform",
    defaultConfig: { code: "return data;" },
    configSchema: {
      fields: [
        { name: "code", type: "textarea", label: "JavaScript Code" },
      ],
    },
  },

  // Output
  {
    type: "response",
    nodeType: "output",
    label: "Response",
    description: "Return workflow response",
    icon: "Send",
    category: "Output",
    defaultConfig: { statusCode: 200, body: "" },
    configSchema: {
      fields: [
        { name: "statusCode", type: "number", label: "Status Code" },
        { name: "body", type: "textarea", label: "Response Body" },
      ],
    },
  },
  {
    type: "log",
    nodeType: "output",
    label: "Log",
    description: "Log data for debugging",
    icon: "FileText",
    category: "Output",
    defaultConfig: { level: "info", message: "" },
    configSchema: {
      fields: [
        { name: "level", type: "select", label: "Level", options: [
          { value: "info", label: "Info" },
          { value: "warn", label: "Warning" },
          { value: "error", label: "Error" },
        ]},
        { name: "message", type: "text", label: "Message" },
      ],
    },
  },
];

export const getTemplateByType = (type: string): NodeTemplate | undefined => {
  return nodeTemplates.find((t) => t.type === type);
};

export const getTemplatesByCategory = (): Record<string, NodeTemplate[]> => {
  return nodeTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, NodeTemplate[]>);
};
