'use client'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { AuthButton } from './AuthButton'
import { supabase } from "@lib/superbase"
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

interface PostActionsProps {
    slug: string
    postId: string
}

export function PostActions({ slug, postId }: PostActionsProps) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleEdit = () => {
        router.push(`/blog/${slug}/edit`)
    }

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)

            if (error) throw error

            toast.success('포스트가 삭제되었습니다.')
            router.push('/blog')
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('삭제 중 오류가 발생했습니다.')
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <AuthButton
                    icon={Pencil}
                    label=""
                    variant="secondary"
                    onClick={handleEdit}
                />
                <AuthButton
                    icon={Trash2}
                    label=""
                    variant="secondary"
                    onClick={() => setShowDeleteDialog(true)}
                />
            </div>

            <AlertDialog open={showDeleteDialog}
                         onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 포스트가 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-neutral-800 text-white cursor-pointer"
                        >
                            {isDeleting ? '삭제 중...' : '삭제'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}