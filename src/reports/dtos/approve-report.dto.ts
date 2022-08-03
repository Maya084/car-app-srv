import { IsBoolean } from "class-validator";

export class ApproveDto {
    @IsBoolean()
    approved: boolean;
}