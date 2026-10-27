import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/mock-data";
import {
  type Institution,
  loadLastInstitution,
  saveLastInstitution,
} from "@/lib/institutions";
import {
  type AuthStep,
  type Credentials,
  getDemoCredentials,
  getRoleOption,
  notifyAuthResult,
  CredentialsForm,
  InstitutionStep,
  LoginFooter,
  LoginHeader,
  LoginShowcase,
  MobileBrand,
  QuickLoginGrid,
  RoleRibbon,
} from "@/components/auth";

export function LoginPage() {
  const { login } = useAuth();

  const [step, setStep] = useState<AuthStep>("institution");
  const [institution, setInstitution] = useState<Institution>();
  const [remembered, setRemembered] = useState<Institution>();
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [credentials, setCredentials] = useState<Credentials>(() =>
    getDemoCredentials("admin"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  // localStorage is only available client-side, so read it after mount
  useEffect(() => {
    setRemembered(loadLastInstitution());
  }, []);

  const authenticate = useCallback(
    async (role: Role, creds: Credentials, quick = false) => {
      setIsLoading(true);
      try {
        await login(role, creds);
        notifyAuthResult(role, true, quick);
      } catch {
        notifyAuthResult(role, false, quick);
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  // When changing roles, automatically update suggested credentials
  const handleRoleChange = useCallback(
    (role: Role) => {
      setSelectedRole(role);
      setCredentials(getDemoCredentials(role, institution));
    },
    [institution],
  );

  const handleQuickLogin = useCallback(
    (role: Role) => {
      handleRoleChange(role);
      void authenticate(role, getDemoCredentials(role, institution), true);
    },
    [institution, handleRoleChange, authenticate],
  );

  const handleSignIn = useCallback(
    () => void authenticate(selectedRole, credentials),
    [credentials, selectedRole, authenticate],
  );

  const handleSelectInstitution = useCallback(
    (inst: Institution) => {
      setInstitution(inst);
      setRemembered(inst);
      saveLastInstitution(inst);
      setCredentials(getDemoCredentials(selectedRole, inst));
      setStep("login");
    },
    [selectedRole],
  );

  const forget = useCallback(() => setRemembered(undefined), []);
  const switchInstitution = useCallback(() => setStep("institution"), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground antialiased selection:bg-accent/20">
      <LoginShowcase institution={institution} />

      {/* ── Right Pristine Login Column ── */}
      <div className="flex-1 lg:w-[60%] xl:w-[62%] flex flex-col justify-between p-6 sm:p-8 lg:p-8 xl:p-10 overflow-y-auto">
        <div className="w-full max-w-2xl xl:max-w-3xl mx-auto my-auto py-2 sm:py-4">
          <MobileBrand institution={institution} />

          {step === "institution" || !institution ? (
            <InstitutionStep
              remembered={remembered}
              onSelect={handleSelectInstitution}
              onForgetRemembered={forget}
            />
          ) : (
            <div
              key={institution.id}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <LoginHeader
                institution={institution}
                helpOpen={helpOpen}
                onHelpOpenChange={setHelpOpen}
                onSwitchInstitution={switchInstitution}
              />
              <RoleRibbon
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
              <CredentialsForm
                institution={institution}
                credentials={credentials}
                roleLabel={getRoleOption(selectedRole)?.label}
                isLoading={isLoading}
                onCredentialsChange={setCredentials}
                onSubmit={handleSignIn}
                onForgotPassword={openHelp}
              />
              <QuickLoginGrid
                selectedRole={selectedRole}
                isLoading={isLoading}
                onQuickLogin={handleQuickLogin}
              />
            </div>
          )}
        </div>

        <LoginFooter institution={institution} onOpenHelp={openHelp} />
      </div>
    </div>
  );
}
