

import { Box, TextField, Button } from "@mui/material";
import MyConfigHeader from "./components/MyConfigHeader";
import { pageContainerSx } from "./styles/myConfigStyles";
import useMyConfig from "./hooks/useMyConfig";
import PasswordChangeForm from "./components/PasswordChangeForm";
import UserInfoCard from "./components/UserInfoCard";

export default function MyConfigPage() {
    const {
        actualPassword,
        setActualPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        submitting,
        handleSubmit,
    } = useMyConfig();

    return (
        <Box sx={pageContainerSx}>
            <MyConfigHeader />

            <UserInfoCard />

            <PasswordChangeForm
                actualPassword={actualPassword}
                setActualPassword={setActualPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                submitting={submitting}
                handleSubmit={handleSubmit}
            />
        </Box>
    );
}
