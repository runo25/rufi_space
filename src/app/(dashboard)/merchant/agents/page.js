"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";

export default function MerchantAgentsPage() {
  const { data: session } = useSession();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchAgents();
    }
  }, [session]);

  const fetchAgents = async () => {
    setLoading(true);
    const { error, data } = await apiClient("merchants/agents?offset=0&limit=100", { session });
    
    if (error) {
      if (error !== "TOKEN_EXPIRED") setError(error);
    } else {
      setAgents(data.data || []);
    }
    setLoading(false);
  };

  const handleVerifyAgent = async (agentId, currentState) => {
    if (!confirm(`Are you sure you want to ${currentState ? 'unverify' : 'verify'} this agent?`)) return;

    const { error, data } = await apiClient("merchants/verify-agent", {
      method: "POST",
      session,
      body: JSON.stringify({ 
        agent_id: agentId,
        is_verified: !currentState 
      })
    });
    
    if (!error) {
      // Optimistically update the UI
      setAgents(agents.map(a => 
        a.id === agentId ? { ...a, is_verified: !currentState } : a
      ));
    } else {
      alert(`Failed: ${error}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          MANAGE AGENTS
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING AGENTS...</div>
      ) : agents.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">No agents registered under your merchant account.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase hairline-b">
                <th className="p-4">Agent Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} className="hairline-b hover:bg-surface-container-lowest transition-colors font-body-md text-on-surface">
                  <td className="p-4">
                    <div className="font-bold">{agent.full_name}</div>
                    <div className="text-xs text-on-surface-variant">ID: {agent.id.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    {agent.company || "Independent"}
                  </td>
                  <td className="p-4">
                    <div>{agent.email}</div>
                    <div className="text-sm text-on-surface-variant">{agent.phone || agent.primary_phone}</div>
                  </td>
                  <td className="p-4">
                    {agent.is_verified ? (
                      <span className="text-green-600 font-label-caps text-xs">VERIFIED</span>
                    ) : (
                      <span className="text-orange-500 font-label-caps text-xs">PENDING</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="outline" 
                      className={`text-xs py-1 px-3 ${agent.is_verified ? 'text-orange-500' : 'text-green-600'}`}
                      onClick={() => handleVerifyAgent(agent.id, agent.is_verified)}
                    >
                      {agent.is_verified ? 'UNVERIFY' : 'VERIFY'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}