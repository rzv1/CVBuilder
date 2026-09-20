<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Engineering Guidelines & Constraints for AI Code Generation

## 1. UI Components & Documentation Source
- You are working with a custom Shadcn registry utilizing **Ark UI**. 
- **Mandatory Documentation Source:** Whenever you need component APIs, examples, or implementation details, strictly refer to and follow the documentation at: https://ark-cn.vercel.app/docs/components/
- **Do not invent or build custom components** (like custom date-pickers or modals) if they are already provided by the Ark UI / Shadcn ecosystem. Always use the designated library tags and primitives.

## 2. Code Modifying & Minimalism
- **Minimal Diffs:** Modify only the absolute minimum lines of code required to achieve the task. 
- **No Over-refactoring:** Do not rewrite entire files, change unrelated components, or introduce unrequested abstractions.

## 3. Architecture & State Management (Anti-Prop-Drilling)
- **Strictly No Prop Drilling:** Do not pass props through more than two intermediate component layers.
- If data or callbacks are needed deep down the component tree, utilize local state colocation, React Context, or state management primitives already present in the project instead of drilling props manually through parent-child chains.
