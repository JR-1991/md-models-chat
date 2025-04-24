import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileUp, HelpCircle } from "lucide-react";

interface UploadFormProps {
    fileName: string;
    selectedModel: string | null;
    openAIKey: string;
    options: string[];
    isLoading: boolean;
    onFileUpload: (content: string, fileName: string) => void;
    onModelChange: (value: string) => void;
    onOpenAIKeyChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function UploadForm({
    fileName,
    selectedModel,
    openAIKey,
    options,
    isLoading,
    onFileUpload,
    onModelChange,
    onOpenAIKeyChange,
    onSubmit,
}: UploadFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileUpload(content, file.name);
            };
            reader.readAsText(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="shadow-lg bg-[#161b22] border-gray-700 mb-8">
            <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold text-gray-100">
                    <FileUp className="mr-2" /> Upload Markdown Model
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* File Upload Input */}
                        <div className="space-y-2">
                            <Label htmlFor="file-upload" className="flex items-center text-gray-300">
                                Upload File
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Upload a markdown file (.md)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".md"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="bg-[#0d1117] border-gray-700 text-white hover:bg-gray-800"
                                >
                                    Choose File
                                </Button>
                                <div className="flex-1 truncate px-3 py-2 rounded bg-[#0d1117] border border-gray-700 text-gray-400">
                                    {fileName || "No file selected"}
                                </div>
                            </div>
                        </div>

                        {/* Model Select */}
                        <div className="space-y-2">
                            <Label htmlFor="option" className="flex items-center text-gray-300">
                                Select Model
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Choose a model for data processing</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Label>
                            <Select
                                onValueChange={onModelChange}
                                disabled={options.length === 0}
                                value={selectedModel || undefined}
                            >
                                <SelectTrigger className="bg-[#0d1117] border-gray-700 text-white">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0d1117] border-gray-700 text-white">
                                    {options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* OpenAI Key Input */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="openai-key" className="flex items-center text-gray-300">
                                OpenAI Key
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Enter your OpenAI API key</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Label>
                            <Input
                                id="openai-key"
                                type="password"
                                value={openAIKey}
                                onChange={(e) => onOpenAIKeyChange(e.target.value)}
                                placeholder="Enter your OpenAI API key"
                                className="bg-[#0d1117] border-gray-700 text-white placeholder-gray-500"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#238636] hover:bg-[#2ea043] text-white"
                        disabled={!selectedModel || isLoading || !fileName}
                    >
                        {isLoading ? "Loading..." : "Extract Data"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 