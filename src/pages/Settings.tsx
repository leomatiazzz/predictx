import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/main'

export default function Settings() {
  const { walletConnected, disconnectWallet } = useAppStore()

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="glass-panel p-8 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Connection Status</h3>
          {walletConnected ? (
            <div>
              <p className="text-success mb-4 text-sm font-medium">Wallet Connected securely.</p>
              <Button variant="destructive" onClick={disconnectWallet}>
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No wallet connected. Use the header button to connect.
            </p>
          )}
        </div>
        <div className="pt-6 border-t border-border/50">
          <h3 className="text-lg font-medium mb-2">Platform Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all local configurations to default.
          </p>
          <Button variant="outline">Reset Configuration</Button>
        </div>
      </div>
    </div>
  )
}
