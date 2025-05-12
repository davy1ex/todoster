import { BrainDump } from "@/widgets/brainDump/ui/BrainDump"
import "./App.css"

export type Platform = 'web' | 'desktop' | 'android';

interface AppProps {
    platform: Platform;
}

export const App = ({ platform }: AppProps) => {
    return (
        <div className={`app app--${platform}`}>
            <BrainDump />
        </div>
    )
}
