import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, X, Settings2, FileText, Brain, CheckCircle } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { Viewer } from "@/components/Viewer";
import { KnowledgeGraph as KnowledgeGraphType } from "@/utils/requests";
import { EvaluateSchemaPromptResponse } from "@/utils/requests";
import { ResponseSettingsModal } from "@/components/ResponseSettingsModal";
import { cn } from "@/lib/utils";

interface ResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEvaluating: boolean;
    jsonData: any;
    evaluation: EvaluateSchemaPromptResponse;
    graph: KnowledgeGraphType;
    settings: {
        enableSchemaEvaluation: boolean;
        enableKnowledgeGraph: boolean;
        enableJsonExtraction: boolean;
        enableMultipleOutputs: boolean;
    };
    onDownload: () => void;
    onSettingsChange: (key: string, value: boolean) => void;
}

type TabType = "evaluation" | "knowledgeGraph" | "json";

export function ResponseModal({
    isOpen,
    onClose,
    isEvaluating,
    jsonData,
    evaluation,
    graph,
    settings,
    onDownload,
    onSettingsChange,
}: ResponseModalProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("evaluation");

    // Get enabled tabs based on settings
    const enabledTabs: TabType[] = [];
    if (settings.enableSchemaEvaluation) enabledTabs.push("evaluation");
    if (settings.enableKnowledgeGraph) enabledTabs.push("knowledgeGraph");
    if (settings.enableJsonExtraction) enabledTabs.push("json");

    // Update active tab when settings change
    React.useEffect(() => {
        if (enabledTabs.length > 0 && !enabledTabs.includes(activeTab)) {
            setActiveTab(enabledTabs[0]);
        }
    }, [enabledTabs, activeTab]);

    if (!isOpen) return null;

    const menuItems = [
        {
            id: "evaluation" as TabType,
            label: "Schema Evaluation",
            icon: CheckCircle,
            enabled: settings.enableSchemaEvaluation,
            hasData: evaluation.reason,
        },
        {
            id: "knowledgeGraph" as TabType,
            label: "Knowledge Graph",
            icon: Brain,
            enabled: settings.enableKnowledgeGraph,
            hasData: graph.triplets?.length > 0,
        },
        {
            id: "json" as TabType,
            label: "JSON Extraction",
            icon: FileText,
            enabled: settings.enableJsonExtraction,
            hasData: jsonData && JSON.stringify(jsonData) !== "{}",
        },
    ];

    return (
        <>
            <div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/50">
                <div className="bg-[#0d1117] border border-gray-700 rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-700">
                        <h2 className="text-2xl font-semibold text-white">Response Analysis</h2>
                        <div className="flex gap-2 items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => setIsSettingsOpen(true)}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-[#21262d] border-gray-600 hover:bg-[#30363d] text-white"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Configure response settings</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onDownload}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-[#21262d] border-gray-600 hover:bg-[#30363d] text-white"
                                        disabled={!settings.enableJsonExtraction}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download JSON {!settings.enableJsonExtraction ? '(Enable JSON Extraction first)' : ''}</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-[#21262d] border-gray-600 hover:bg-[#30363d] text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex overflow-hidden flex-1">
                        {/* Left Menu */}
                        <div className="w-64 bg-[#161b22] border-r border-gray-700 p-4 overflow-y-auto">
                            <div className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    const isDisabled = !item.enabled;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => !isDisabled && setActiveTab(item.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                                                isActive && !isDisabled
                                                    ? "bg-[#238636] text-white"
                                                    : isDisabled
                                                        ? "text-gray-500 cursor-not-allowed"
                                                        : "text-gray-300 hover:bg-[#30363d] hover:text-white"
                                            )}
                                            disabled={isDisabled}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <div className="w-2 h-2 bg-current rounded-full opacity-70" />
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium">{item.label}</span>
                                            {isDisabled && (
                                                <span className="ml-auto text-xs text-gray-500">Disabled</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="overflow-hidden flex-1">
                            {isEvaluating ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spinner size="lg" color="secondary" />
                                </div>
                            ) : (
                                <div className="overflow-y-auto p-6 h-full">
                                    <Viewer
                                        jsonData={JSON.stringify(jsonData, null, 2)}
                                        evaluation={evaluation}
                                        knowledgeGraph={graph}
                                        settings={settings}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ResponseSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSettingsChange={onSettingsChange}
            />
        </>
    );
} 