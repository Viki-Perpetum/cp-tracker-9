import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, Clock, XCircle, Search, FileText, ChevronRight } from "lucide-react";

const CPS = [
  { id: "CP-01", name: "Site Preparation & Earthworks", contractor: "Heijmans NV", drawdownDate: "2024-07-15", drawdownAmount: "€ 2.4M", progress: 100, status: "complete", belfiusCond: "met", missingDocs: [], milestones: [{label:"Soil survey",done:true},{label:"Demolition clearance",done:true},{label:"Foundation approval",done:true}] },
  { id: "CP-02", name: "Concrete Structure – Phase 1", contractor: "Besix Group", drawdownDate: "2024-09-30", drawdownAmount: "€ 5.1M", progress: 78, status: "at-risk", belfiusCond: "pending", missingDocs: ["Structural engineer sign-off","Insurance certificate update"], milestones: [{label:"Formwork inspection",done:true},{label:"Pour completion B1–B3",done:true},{label:"Structural sign-off",done:false},{label:"Waterproofing cert",done:false}] },
  { id: "CP-03", name: "MEP Rough-In", contractor: "Cofely Fabricom", drawdownDate: "2024-11-15", drawdownAmount: "€ 3.8M", progress: 45, status: "at-risk", belfiusCond: "pending", missingDocs: ["Revised MEP drawings v4","Fire authority pre-approval"], milestones: [{label:"HVAC duct install",done:true},{label:"Electrical rough-in",done:false},{label:"Plumbing pressure test",done:false},{label:"Fire suppression layout",done:false}] },
  { id: "CP-04", name: "Façade & Cladding", contractor: "Lindner AG", drawdownDate: "2025-01-20", drawdownAmount: "€ 4.2M", progress: 12, status: "blocked", belfiusCond: "not-met", missingDocs: ["Façade warranty doc","Thermal performance cert","Contractor bond extension"], milestones: [{label:"Sample panel approval",done:false},{label:"Anchor system audit",done:false},{label:"Installation start",done:false},{label:"Weathertight cert",done:false}] },
  { id: "CP-05", name: "Interior Fit-Out – Level 1–5", contractor: "Interiors Co.", drawdownDate: "2025-03-10", drawdownAmount: "€ 6.7M", progress: 5, status: "on-track", belfiusCond: "not-required", missingDocs: [], milestones: [{label:"Partition layout sign-off",done:false},{label:"Floor screed",done:false},{label:"Ceiling grid",done:false},{label:"Snag list phase 1",done:false}] },
  { id: "CP-06", name: "Roofing & Waterproofing", contractor: "Derbigum SA", drawdownDate: "2024-10-31", drawdownAmount: "€ 1.9M", progress: 91, status: "on-track", belfiusCond: "met", missingDocs: [], milestones: [{label:"Insulation layer",done:true},{label:"Membrane install",done:true},{label:"Drainage testing",done:true},{label:"Final warranty",done:false}] }
];

const statusMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  "complete":    { label: "Complete",  color: "bg-green-500/15 text-green-600 border-green-500/30",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  "on-track":   { label: "On Track",  color: "bg-blue-500/15 text-blue-600 border-blue-500/30",     icon: <Clock className="w-3.5 h-3.5" /> },
  "at-risk":    { label: "At Risk",   color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  "blocked":    { label: "Blocked",   color: "bg-red-500/15 text-red-600 border-red-500/30",         icon: <XCircle className="w-3.5 h-3.5" /> }
};

const condMeta: Record<string, { label: string; color: string }> = {
  "met":          { label: "Met",         color: "bg-green-500/15 text-green-600 border-green-500/30" },
  "pending":      { label: "Pending",     color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  "not-met":      { label: "Not Met",     color: "bg-red-500/15 text-red-600 border-red-500/30" },
  "not-required": { label: "N/A",         color: "bg-muted text-muted-foreground border-border" }
};

export default function CpTracker() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<typeof CPS[0] | null>(null);

  const filtered = CPS.filter(cp => {
    const matchSearch = cp.name.toLowerCase().includes(search.toLowerCase()) || cp.contractor.toLowerCase().includes(search.toLowerCase()) || cp.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || cp.status === tab;
    return matchSearch && matchTab;
  });

  const kpi = {
    total: CPS.length,
    blocked: CPS.filter(c => c.status === "blocked").length,
    atRisk: CPS.filter(c => c.status === "at-risk").length,
    missingDocs: CPS.reduce((a, c) => a + c.missingDocs.length, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Working prototype of CP Checker, made by Viki !!</h1>
        <p className="text-muted-foreground mt-1">Single source of truth for Construction Packages, Belfius conditions, and contractor deliverables.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total CPs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{kpi.total}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blocked</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-red-600">{kpi.blocked}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">At Risk</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-yellow-600">{kpi.atRisk}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Missing Docs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{kpi.missingDocs}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
                <TabsTrigger value="at-risk">At Risk</TabsTrigger>
                <TabsTrigger value="on-track">On Track</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search CP, contractor…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">CP</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Drawdown Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Belfius</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(cp => {
                const sm = statusMeta[cp.status];
                const cm = condMeta[cp.belfiusCond];
                return (
                  <TableRow key={cp.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell className="pl-6">
                      <div className="font-semibold text-foreground">{cp.id}</div>
                      <div className="text-xs text-muted-foreground max-w-[160px] truncate">{cp.name}</div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{cp.contractor}</TableCell>
                    <TableCell className="text-sm text-foreground">{cp.drawdownDate}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{cp.drawdownAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${cp.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{cp.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`flex items-center gap-1 w-fit text-xs ${sm.color}`}>{sm.icon}{sm.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${cm.color}`}>{cm.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {cp.missingDocs.length > 0
                        ? <span className="flex items-center gap-1 text-xs text-red-600"><FileText className="w-3.5 h-3.5" />{cp.missingDocs.length} missing</span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setSelected(cp)}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{selected?.id} — {selected?.name}</DialogTitle>
                          </DialogHeader>
                          {selected && (
                            <div className="space-y-4 text-sm">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Contractor</p><p className="font-medium text-foreground">{selected.contractor}</p></div>
                                <div className="bg-muted rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Drawdown</p><p className="font-medium text-foreground">{selected.drawdownDate}</p></div>
                                <div className="bg-muted rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Amount</p><p className="font-medium text-foreground">{selected.drawdownAmount}</p></div>
                                <div className="bg-muted rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Belfius Cond.</p><Badge variant="outline" className={`text-xs ${condMeta[selected.belfiusCond].color}`}>{condMeta[selected.belfiusCond].label}</Badge></div>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground mb-2">Milestones</p>
                                <ul className="space-y-1.5">
                                  {selected.milestones.map((m, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      {m.done ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <Clock className="w-4 h-4 text-muted-foreground shrink-0" />}
                                      <span className={m.done ? "text-foreground" : "text-muted-foreground"}>{m.label}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {selected.missingDocs.length > 0 && (
                                <div>
                                  <p className="font-semibold text-red-600 mb-2">Missing Documents</p>
                                  <ul className="space-y-1.5">
                                    {selected.missingDocs.map((d, i) => (
                                      <li key={i} className="flex items-center gap-2 text-red-600">
                                        <XCircle className="w-4 h-4 shrink-0" />{d}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No construction packages match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
