import axios from "axios";

const DOMAIN = "openapi-rdc.aliyuncs.com";
const ORGANIZATION_ID = "68099369632c29a8cb203946";
const REPOSITORY_ID = "5582713";
const TOKEN = "pt-X1nlwgmNaWuppPBLyUo7OHR4_74d557d0-f5bb-4d5d-a0e7-171956472d6d";
const REF = "feature_ui";

function getHeaders() {
  return {
    "x-yunxiao-token": TOKEN,
  };
}

async function fetchFileSource(filePath: string): Promise<string> {
  const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(filePath)}?ref=${REF}`;
  const res = await axios.get(url, { headers: getHeaders() });
  if (!res.data?.content) throw new Error("No content in API response");
  return Buffer.from(res.data.content, "base64").toString("utf-8");
}

async function getComponentSource(componentName: string): Promise<string> {
  const filePath = `src/components/ui/${componentName}.tsx`;
  return fetchFileSource(filePath);
}

async function getComponentDemo(componentName: string): Promise<string[]> {
  const filePath = `src/app/docs/components/${componentName}/page.tsx`;
  const fileContent = await fetchFileSource(filePath);
  // 提取 /* Usage Examples */ 后所有 CodeSnippet 的 code 属性
  const usageSection = fileContent.split("/* Usage Examples */")[1] || "";
  const codeSnippets = [...usageSection.matchAll(/<CodeSnippet[^>]*code=\{`([\s\S]*?)`\}/g)];
  return codeSnippets.map(match => match[1]);
}

export const fallbackComponents = [
  "avatar",
  "button",
  "carousel",
  "chat-input",
  "checkbox",
  "code-display",
  "code-snippet",
  "dialog-pure",
  "drawer",
  "form",
  "input",
  "permissions-table",
  "radio-group",
  "select",
  "sidebar",
  "table",
  "tabs",
  "textarea",
  "toast",
  "tooltip",
  "topbar",
  "upload",
  "docs-layout",
  "permissions-table-pure",
  "select-pure",
  "sidebar-pure"
];

async function getAvailableComponents(): Promise<string[]> {
  const path = encodeURIComponent("src/components/ui");
  const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/tree?path=${path}&ref=${REF}&type=blob`;
  try {
    const res = await axios.get(url, { headers: getHeaders() });
    if (!Array.isArray(res.data)) throw new Error("Invalid response from tree API");
    const names = res.data
      .filter((item: any) => item.name.endsWith('.tsx'))
      .map((item: any) => item.name.replace(/\.tsx$/, ''));
    if (names.length === 0) return fallbackComponents;
    return names;
  } catch (e) {
    return fallbackComponents;
  }
}

export const oneportAxios = {
  getComponentSource,
  getComponentDemo,
  getAvailableComponents,
};
