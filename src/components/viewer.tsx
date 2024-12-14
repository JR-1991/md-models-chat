import React from "react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import FitBadge from "@/components/fitbadge";
import { Badge } from "./ui/badge";
import { KnowledgeGraph as KnowledgeGraphType } from "@/utils/requests";
import { KnowledgeGraph } from "./knowledge-graph";
import { Spinner } from "./spinner";

interface ViewerProps {
  jsonData: string;
  evaluation: {
    fits: boolean;
    reason: string;
  };
  className?: string;
  knowledgeGraph: KnowledgeGraphType;
}

export function Viewer({
  jsonData,
  evaluation,
  className,
  knowledgeGraph,
}: ViewerProps) {
  const [activeTab, setActiveTab] = React.useState<
    "json" | "evaluation" | "knowledgeGraph"
  >("evaluation");

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto rounded-md overflow-hidden border border-[#30363d] bg-[#0d1117]",
        className
      )}
    >
      {/* GitHub-style header tabs */}
      <div className="flex border-b border-[#30363d]">
        <button
          onClick={() => setActiveTab("evaluation")}
          className={cn(
            "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
            activeTab === "evaluation"
              ? "text-white border-[#f78166] bg-[#0d1117]"
              : "text-[#7d8590] border-transparent hover:text-[#e6edf3] hover:border-[#424a53]"
          )}
        >
          Evaluation
        </button>
        <button
          onClick={() => setActiveTab("knowledgeGraph")}
          className={cn(
            "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
            activeTab === "knowledgeGraph"
              ? "text-white border-[#f78166] bg-[#0d1117]"
              : "text-[#7d8590] border-transparent hover:text-[#e6edf3] hover:border-[#424a53]"
          )}
        >
          Knowledge Graph
        </button>
        <button
          onClick={() => setActiveTab("json")}
          className={cn(
            "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
            activeTab === "json"
              ? "text-white border-[#f78166] bg-[#0d1117]"
              : "text-[#7d8590] border-transparent hover:text-[#e6edf3] hover:border-[#424a53]"
          )}
        >
          JSON
        </button>
      </div>

      {/* Content area */}
      <div className="relative">
        <div
          className={cn(
            "transition-opacity duration-200 text-sm",
            activeTab === "json"
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          )}
        >
          {jsonData !== "{}" ? (
            <SyntaxHighlighter
              language="json"
              style={{
                ...oneDark,
                'pre[class*="language-"]': {
                  ...oneDark['pre[class*="language-"]'],
                  background: "transparent",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                },
                'code[class*="language-"]': {
                  ...oneDark['code[class*="language-"]'],
                  background: "transparent",
                },
              }}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
              wrapLongLines={true}
              wrapLines={true}
            >
              {jsonData}
            </SyntaxHighlighter>
          ) : !evaluation.fits && jsonData === "{}" ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <p>No Data</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Spinner color="secondary" />
            </div>
          )}
        </div>
        <div
          className={cn(
            "transition-opacity duration-200",
            activeTab === "evaluation"
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          )}
        >
          <div className="p-4 text-[#e6edf3] prose prose-invert max-w-none text-sm mx-4 leading-relaxed overflow-scroll">
            {evaluation.reason ? (
              <>
                <FitBadge fits={evaluation.fits} />
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-4 leading-loose">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold mt-6 mb-3 leading-loose">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold mt-4 mb-2 leading-loose">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 text-[#e6edf3] leading-relaxed">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li className="my-3">{children}</li>,
                    p: ({ children }) => (
                      <p className="mb-4 text-[#e6edf3] leading-relaxed">
                        {children}
                      </p>
                    ),
                    em: ({ children }) => (
                      <Badge
                        className="bg-gray-800 mx-[1px] hover:bg-gray-700"
                        variant="default"
                      >
                        {children}
                      </Badge>
                    ),
                  }}
                >
                  {evaluation.reason}
                </ReactMarkdown>
              </>
            ) : (
              <div className="flex justify-center items-center h-40 text-gray-500">
                <p>No Data</p>
              </div>
            )}
          </div>
        </div>
        <div
          className={cn(
            "transition-opacity duration-200",
            activeTab === "knowledgeGraph"
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          )}
        >
          {evaluation.reason || knowledgeGraph.triplets?.length > 0 ? (
            knowledgeGraph.triplets?.length > 0 ? (
              <KnowledgeGraph knowledgeGraph={knowledgeGraph} />
            ) : (
              <div className="flex justify-center items-center h-40">
                <Spinner color="secondary" />
              </div>
            )
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-500 text-sm">
              <p>No Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
