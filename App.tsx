import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ToolType } from './types';
import { YamlJsonTool } from './features/YamlJsonTool';
import { Base64Tool } from './features/Base64Tool';
import { CronTool } from './features/CronTool';
import { DockerfileGenerator } from './features/DockerfileGenerator';
import { K8sGenerator } from './features/K8sGenerator';
import { SshTool } from './features/SshTool';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.YAML_JSON);

  const renderTool = () => {
    switch (currentTool) {
      case ToolType.YAML_JSON:
        return <YamlJsonTool />;
      case ToolType.BASE64:
        return <Base64Tool />;
      case ToolType.CRON:
        return <CronTool />;
      case ToolType.DOCKERFILE:
        return <DockerfileGenerator />;
      case ToolType.K8S_MANIFEST:
        return <K8sGenerator />;
      case ToolType.SSH_GEN:
        return <SshTool />;
      default:
        return <YamlJsonTool />;
    }
  };

  return (
    <Layout currentTool={currentTool} onToolChange={setCurrentTool}>
      {renderTool()}
    </Layout>
  );
};

export default App;