import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiStackLine } from "react-icons/ri";
import { Switch } from "@/components/ui/switch";
import { Download, Github, HelpCircle } from "lucide-react";
import fetchFromGitHub, {
  convertGitHubURLToUserRepo,
  listMdFiles,
} from "@/utils/github";
import getMdModelObjects, { getJSONSchema, isMdModel } from "@/utils/mdmodels";
import {
  createKnowledgeGraph,
  evaluateSchemaPrompt,
  EvaluateSchemaPromptResponse,
  extractToSchema,
} from "@/utils/requests";
import { Spinner } from "@/components/spinner";
import { Viewer } from "@/components/viewer";
import { KnowledgeGraph as KnowledgeGraphType } from "@/utils/requests";
export default function Dashboard() {
  const [githubUrl, setGithubUrl] = useState(() => {
    return (
      localStorage.getItem("githubUrl") ||
      "Strenda-biocatalysis/Strenda-biocatalysis"
    );
  });

  const [path, setPath] = useState(() => {
    return localStorage.getItem("selectedPath") || "";
  });

  const [selectedModel, setSelectedOption] = useState<string | null>(() => {
    return localStorage.getItem("selectedOption") || null;
  });

  const [preprompt] = useState(() => {
    return localStorage.getItem("preprompt") || "";
  });

  const [leftPanelText, setLeftPanelText] = useState(() => {
    return localStorage.getItem("leftPanelText") || "";
  });

  const [markdownContent, setMarkdownContent] = useState("");
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [options, setOptions] = useState([]);
  const [openAIKey, setOpenAIKey] = useState("");
  const [jsonData, setJsonData] = useState({});
  const [isMultiple, setIsMultiple] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [graph, setGraph] = useState<KnowledgeGraphType>({ triplets: [] });
  const [evaluation, setEvaluation] = useState<EvaluateSchemaPromptResponse>({
    fits: false,
    reason: "",
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Handle GitHub URL processing and file listing
  const processGitHubUrl = async (url: string) => {
    if (url.includes("github.com")) {
      const [user, repo] = convertGitHubURLToUserRepo(url);
      const combinedUserRepo = `${user}/${repo}`;
      setGithubUrl(combinedUserRepo);
      return combinedUserRepo;
    }
    return url;
  };

  // Filter markdown files that are valid models
  const getFilteredMdFiles = async (repoPath: string) => {
    const files = await listMdFiles(repoPath);
    const filteredFiles = await Promise.all(
      files.map((file) => isMdModel(repoPath, file))
    ).then((results) => files.filter((_, index) => results[index]));
    return filteredFiles;
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      const processedUrl = await processGitHubUrl(githubUrl);
      const filteredFiles = await getFilteredMdFiles(processedUrl);
      setAvailableFiles(filteredFiles);
      localStorage.setItem("githubUrl", githubUrl);
    }, 1500);

    return () => clearTimeout(debounceTimeout);
  }, [githubUrl]);

  useEffect(() => {
    if (!path) {
      return;
    }
    fetchFromGitHub(githubUrl, path).then((data) => {
      const objects = getMdModelObjects(data);
      setOptions(objects);
      setMarkdownContent(data);
    });
    localStorage.setItem("selectedPath", path);
  }, [path]);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem("selectedOption", selectedModel);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (leftPanelText) {
      localStorage.setItem("leftPanelText", leftPanelText);
    }
  }, [leftPanelText]);

  useEffect(() => {
    if (preprompt) {
      localStorage.setItem("preprompt", preprompt);
    }
  }, [preprompt]);

  useEffect(() => {
    localStorage.setItem("preprompt", preprompt);
  }, [preprompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModel) {
      setIsLoading(true);
      setIsEvaluating(true);
      const schema = await getJSONSchema(markdownContent, selectedModel);

      const evaluation = await evaluateSchemaPrompt(
        leftPanelText,
        schema,
        openAIKey
      );

      const graph = await createKnowledgeGraph(leftPanelText, openAIKey);

      setEvaluation(evaluation);
      setIsEvaluating(false);
      setGraph(graph);

      if (!evaluation.fits) {
        setIsLoading(false);
        setJsonData({});
        setIsLoading(false);
        return;
      }

      if (evaluation.fits) {
        try {
          let jsonData = await extractToSchema(
            graph,
            schema,
            openAIKey,
            isMultiple
          );

          setJsonData(jsonData);
          setIsLoading(false);
        } catch (error) {
          setJsonData({});
          setIsLoading(false);
        }
      }
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0d1117] text-white">
        <main className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute top-40 right-40 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-[1400px] mx-auto px-4 pt-20 pb-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 text-center">
              <RiStackLine className="inline-block mr-2" /> MD-Models Chat
            </h1>
            <p className="text-xl text-gray-400 mb-8 text-center">
              Turn your unstructured data into structured data
            </p>

            <Card className="shadow-lg bg-[#161b22] border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-100 flex items-center">
                  <Github className="mr-2" /> Repository Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="github-url"
                        className="text-gray-300 flex items-center"
                      >
                        GitHub URL
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter the repository user and name. E.g. User/Repo
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="github-url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="User/Repo"
                        className="bg-[#0d1117] border-gray-700 text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="path"
                        className="text-gray-300 flex items-center"
                      >
                        Path
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Specify the file or directory path within the
                              repository
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select
                        onValueChange={setPath}
                        value={path}
                        disabled={availableFiles.length === 0}
                      >
                        <SelectTrigger className="bg-[#0d1117] border-gray-700 text-white">
                          <SelectValue placeholder="Select a path" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0d1117] border-gray-700 text-white ">
                          {availableFiles.map((pathOption) => (
                            <SelectItem value={pathOption}>
                              {pathOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="option"
                        className="text-gray-300 flex items-center"
                      >
                        Select Model
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose a model for data processing</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select
                        onValueChange={setSelectedOption}
                        disabled={options.length === 0}
                        value={selectedModel || undefined}
                      >
                        <SelectTrigger className="bg-[#0d1117] border-gray-700 text-white">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0d1117] border-gray-700 text-white">
                          {options.map((option) => (
                            <SelectItem value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="openai-key"
                        className="text-gray-300 flex items-center"
                      >
                        OpenAI Key
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
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
                        onChange={(e) => setOpenAIKey(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                        className="bg-[#0d1117] border-gray-700 text-white placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white"
                    disabled={!selectedModel || isLoading}
                  >
                    {isLoading ? "Loading..." : "Extract Data"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* <Collapsible
              open={isPrepromptOpen}
              onOpenChange={setIsPrepromptOpen}
              className="mb-8 transition-all duration-300 ease-in-out"
            >
              <Card className="shadow-lg bg-[#161b22] border-gray-700">
                <CardHeader>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between w-full group cursor-pointer">
                      <CardTitle className="text-2xl font-semibold text-gray-100 flex items-center">
                        Preprompt
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a preprompt to guide the data analysis</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      {isPrepromptOpen ? (
                        <ChevronUp className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-180" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-white transition-transform duration-200 group-hover:-rotate-180" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent className="transition-all duration-300 ease-in-out">
                  <CardContent>
                    <Textarea
                      value={preprompt}
                      onChange={(e) => setPreprompt(e.target.value)}
                      placeholder="Enteryour preprompt here..."
                      className="min-h-[100px] bg-[#0d1117] border-gray-700 text-white placeholder-gray-500"
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 [&>*]:h-full">
              <Card className="shadow-lg bg-[#161b22] border-gray-700 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-100 flex items-center">
                    Text Input
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the text you want to parse</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="multiple-switch"
                            className="text-sm text-gray-400"
                          >
                            Multiple
                          </Label>
                          <Switch
                            id="multiple-switch"
                            checked={isMultiple}
                            onCheckedChange={setIsMultiple}
                            className="data-[state=checked]:bg-[#238636]"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle to enable multiple outputs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Textarea
                    value={leftPanelText}
                    onChange={(e) => setLeftPanelText(e.target.value)}
                    placeholder="Enter text here..."
                    className="h-full min-h-[300px] lg:min-h-[400px] bg-[#0d1117] border-gray-700 text-white placeholder-gray-500 text-xl"
                  />
                </CardContent>
              </Card>
              <Card className="shadow-lg bg-[#161b22] border-gray-700 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-100 flex items-center">
                    Response
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          View the data and evaluation of the extracted data.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 bg-[#21262d] border-gray-600 hover:bg-[#30363d] text-white"
                    title="Download JSON"
                  >
                    <Download className="h-3 w-3" />
                    <span className="sr-only">Download JSON</span>
                  </Button>
                </CardHeader>
                <CardContent className="flex-1">
                  {isEvaluating ? (
                    <div className="flex justify-center items-center min-h-[300px] lg:min-h-[400px]">
                      <Spinner size="lg" color="secondary" />
                    </div>
                  ) : (
                    <Viewer
                      jsonData={JSON.stringify(jsonData, null, 2)}
                      evaluation={evaluation}
                      knowledgeGraph={graph}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
