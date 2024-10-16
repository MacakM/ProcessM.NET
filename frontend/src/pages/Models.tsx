import { Button } from '@/components/ui/ShadCN/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/ShadCN/table';
import { ViewModel } from '@/components/ui/ViewModel';
import { exportDot } from '@/helpers/exportDot';
import { exportJson } from '@/helpers/exportJson';
import { exportPnml } from '@/helpers/exportPnml';
import { useModelsDb } from '@/hooks/useModelsDb';
import { RightArrow } from '@/icons/RightArrow';
import SpinnerLogo from '@/icons/SpinnerLoader.svg';
import { ModelType } from '@/models/ImperativeModel';
import { TargetURL } from '@/router';
import { TooltipWrapper } from '@/wrappers/TooltipWrapper';
import { TrashIcon } from 'lucide-react';
import React from 'react';
import { useAsync } from 'react-async-hook';
import { useNavigate, useParams } from 'react-router-dom';

export const Models: React.FC = () => {
    const navigate = useNavigate();
    const { entityName } = useParams();
    const { fetchAllModelsByLogName, deleteModel } = useModelsDb();
    const localModels = useAsync(() => fetchAllModelsByLogName(entityName), []);

    const selectModel = (name: string, type: ModelType) => {
        const destination =
            type === ModelType.DECLARATIVE
                ? TargetURL.DECLARE_MODELS_OPERATION
                : TargetURL.IMPERATIVE_MODELS_OPERATION;

        navigate(destination.replace(':entityName', name));
    };

    const handleDeleteModel = async (key: string) => {
        const deleteResult = await deleteModel(key);

        if (deleteResult) {
            localModels.execute();
        }
    };

    if (localModels.loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <img className="w-20 h-20" src={SpinnerLogo} alt="loader" />
            </div>
        );
    }

    if (localModels.result == undefined) {
        return (
            <div className="w-full h-full flex items-centere justify-center">
                Unable to load models!
            </div>
        );
    }

    const models = localModels.result;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between">
            <div className="w-11/12 md:w-3/4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Export</TableHead>
                            <TableHead className="text-center">
                                Type (Imperative/Declarative)
                            </TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Operations</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {models.map((model) => (
                            <TableRow key={model.name}>
                                <TableCell className="font-medium">
                                    {model.name}
                                </TableCell>
                                <TableCell>
                                    {model.type === ModelType.IMPERATIVE ? (
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() =>
                                                    exportPnml(
                                                        model.name,
                                                        model.model as string
                                                    )
                                                }
                                            >
                                                PNML
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    exportDot(
                                                        model.name,
                                                        model.model as string
                                                    )
                                                }
                                            >
                                                DOT
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                exportJson(
                                                    model.name,
                                                    JSON.stringify(
                                                        model.model,
                                                        undefined,
                                                        2
                                                    )
                                                )
                                            }
                                        >
                                            JSON
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    {model.type === ModelType.IMPERATIVE
                                        ? 'Imperative'
                                        : 'Declarative'}
                                </TableCell>
                                <TableCell>
                                    <ViewModel title={model.name} />
                                </TableCell>
                                <TableCell>
                                    <TooltipWrapper
                                        tooltipContent={
                                            <p>{`${model.name} operations`}</p>
                                        }
                                    >
                                        <div
                                            onClick={() =>
                                                selectModel(
                                                    model.name,
                                                    model.type
                                                )
                                            }
                                            className="rounded-full bg-slate-400 w-8 h-8 flex items-center justify-center hover:shadow-lg hover:cursor-pointer"
                                        >
                                            <RightArrow />
                                        </div>
                                    </TooltipWrapper>
                                </TableCell>
                                <TableCell className="">
                                    <div className="flex justify-end">
                                        <div
                                            onClick={() =>
                                                handleDeleteModel(model.name)
                                            }
                                            className="rounded-full bg-slate-400 w-8 h-8 flex items-center justify-center hover:shadow-lg hover:cursor-pointer"
                                        >
                                            <TrashIcon />
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
