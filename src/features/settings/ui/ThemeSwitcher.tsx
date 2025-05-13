import { useSettings } from "../model/useSettings";
import { useTheme } from "@/shared/theme/ThemeContext";

export const ThemeSwitcher = () => {
    const { toggleTheme } = useSettings();
    const { mode } = useTheme();

    return (
        <div className="toggleTheme" onClick={toggleTheme}>
            {mode === 'light' ?
                (<div className="lightSwitcher">🌝</div>)
            :
                (<div className="darkSwitcher">🌚</div>)
            }
        </div>
    )
}